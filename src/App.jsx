import { apiRequest } from "./api";
import { menus as menuData } from "./data/menuData";
import { useEffect, useMemo, useState } from "react";

import { loadDB, saveDB } from "./utils/storage";
import { generateId, getCartCount, isToday } from "./utils/helpers";
import {
  calculateCartTotal,
  calculateItemPrice,
} from "./utils/price";

import Header from "./components/Header";
import EmployeeModal from "./components/EmployeeModal";

import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeConfirm from "./pages/EmployeeConfirm";
import EmployeeSuccess from "./pages/EmployeeSuccess";
import CustomerType from "./pages/CustomerType";
import ServiceTable from "./pages/ServiceTable";
import MemberLogin from "./pages/MemberLogin";
import MemberRegister from "./pages/MemberRegister";
import RegisterSuccess from "./pages/RegisterSuccess";
import ReservationPage from "./pages/ReservationPage";
import ReservationSuccess from "./pages/ReservationSuccess";
import ReservationHistory from "./pages/ReservationHistory";

import OrderFood from "./pages/OrderFood";
import MenuDetail from "./pages/MenuDetail";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";

import Bill from "./pages/Bill";
import PaymentSummary from "./pages/PaymentSummary";
import PaymentSuccess from "./pages/PaymentSuccess";
import ReviewPage from "./pages/ReviewPage";
import ThankYou from "./pages/ThankYou";

function dbTableToUiTable(table) {
  const rawStatus = table.Status || table.TStatus || "available";
  const uiStatus =
    rawStatus === "available" || rawStatus === "ว่าง" ? "ว่าง" : "ไม่ว่าง";

  return {
    ...table,
    Status: uiStatus,
    TStatus: rawStatus,
  };
}


function getMenuIdentity(menu) {
  const rawId = String(menu?.menuId || menu?.MenuId || menu?.id || "")
    .replace(/\D/g, "")
    .padStart(3, "0");

  const name = String(menu?.name || menu?.MenuName || menu?.menuName || "")
    .trim()
    .toLowerCase();

  return { rawId, name };
}

function isSnackOptionMenu(menu) {
  const { rawId, name } = getMenuIdentity(menu);

  const snackIds = new Set([
    "006",
    "031",
    "032",
    "033",
    "034",
    "035",
    "036",
  ]);

  const snackNames = [
    "ชีสบอล",
    "เฟรนช์ฟรายส์",
    "ไก่ป๊อป",
    "กุ้งชุบแป้งทอด",
    "เอ็นไก่ทอด",
    "นักเก็ต",
    "cheese ball",
    "french fries",
    "fries",
    "nugget",
  ];

  return (
    snackIds.has(rawId) ||
    snackNames.some((item) => name.includes(item.toLowerCase()))
  );
}

function shouldSkipMenuDetail(menu) {
  const { rawId, name } = getMenuIdentity(menu);

  const simpleMenuIds = new Set([
    "007",
    "008",
    "009",
    "010",
    "037",
    "038",
    "039",
    "040",
    "041",
    "042",
    "043",
    "044",
    "045",
    "046",
    "047",
    "048",
    "049",
  ]);

  const simpleNames = [
    "ขนมปังอบไอน้ำ",
    "สละลอยแก้ว",
    "เฉาก๊วย",
    "พานาคอตต้า",
    "บราวนี่",
    "ไอศกรีม",
    "น้ำเปล่า",
    "น้ำส้มคั้นสด",
    "น้ำมะนาว",
    "เป๊ปซี่",
    "pepsi",
    "steamed bread",
    "sala loi kaew",
    "chaokuai",
    "panna cotta",
    "brownie",
  ];

  if (isSnackOptionMenu(menu)) return false;

  return (
    simpleMenuIds.has(rawId) ||
    simpleNames.some((item) => name.includes(item.toLowerCase()))
  );
}

function isSweetnessDrinkMenu(menu) {
  const { rawId, name } = getMenuIdentity(menu);

  const sweetnessDrinkIds = new Set([
    "011", "012", "013", "014", "015",
    "050", "051", "052", "053", "054", "055", "056", "057", "058", "059", "060",
  ]);

  const drinkNames = [
    "ชามะนาว",
    "ชาไทย",
    "เอสเปรสโซ",
    "ลาเต้",
    "อเมริกาโน่",
    "โกโก้",
    "มอคค่า",
    "มัทฉะลาเต้",
    "ชามะลิ",
    "ชาดำ",
    "นมสด",
    "mocha",
    "latte",
    "matcha",
    "cocoa",
    "tea",
  ];

  return (
    sweetnessDrinkIds.has(rawId) ||
    drinkNames.some((item) => name.includes(item.toLowerCase()))
  );
}

function normalizeMenuOptionBehavior(menu) {
  if (!menu) return menu;

  if (isSnackOptionMenu(menu)) {
    return {
      ...menu,
      optionType: "snack",
      options: menu.options || [],
    };
  }

  if (shouldSkipMenuDetail(menu)) {
    return {
      ...menu,
      optionType: "simple",
      options: [],
    };
  }

  if (isSweetnessDrinkMenu(menu)) {
    return {
      ...menu,
      optionType: "drink",
      options: menu.options || [],
    };
  }

  return menu;
}

function uiPaymentToDb(method) {
  const map = {
    "เงินสด": "เงินสด",
    "สแกนคิวอาร์โค้ด": "คิวอาร์โค้ด",
    "คิวอาร์โค้ด": "คิวอาร์โค้ด",
    "บัตรเครดิต/เดบิต": "บัตรเครดิต",
    "บัตรเครดิต": "บัตรเครดิต",
    Cash: "เงินสด",
    "Qr Code": "คิวอาร์โค้ด",
    "QR Code": "คิวอาร์โค้ด",
    "Credit Card": "บัตรเครดิต",
  };

  return map[method] || method || "เงินสด";
}

function formatReservationDate(value) {
  if (!value) return "";

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }

  return text;
}

function formatReservationTime(value) {
  if (!value) return "";

  const text = String(value);

  const timeMatch = text.match(/(\d{2}):(\d{2})/);
  if (timeMatch) {
    return `${timeMatch[1]}:${timeMatch[2]}`;
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return text;
}

function normalizeReservationFromDb(item) {
  return {
    RId: item.RId,
    customerId: item.CId || item.customerId,
    tableNumber: item.TNumber || item.tableNumber,
    RDate: formatReservationDate(item.RDate || item.date),
    RTime: formatReservationTime(item.RTime || item.time),
    PeopleCount: item.PeopleCount || item.peopleCount || item.count || 1,
    status: item.status || item.RStatus || "reserved",
  };
}


function sanitizeCartItemForApi(item) {
  const safeOptions = item?.options
    ? {
        size: item.options.size || "",
        topping: item.options.topping || "",
        toppings: Array.isArray(item.options.toppings) ? item.options.toppings : [],
        drinkType: item.options.drinkType || "",
        sweetness: item.options.sweetness || "",
        note: item.options.note || "",
      }
    : {};

  return {
    cartId: item.cartId || "",
    menuId: item.menuId || item.MenuId || item.id || "",
    MenuId: item.menuId || item.MenuId || item.id || "",
    name: item.name || item.menuName || item.MenuName || "",
    price: Number(item.price || item.finalPrice || item.unitPrice || item.UnitPrice || 0),
    finalPrice: Number(item.finalPrice || item.price || item.unitPrice || item.UnitPrice || 0),
    basePrice: Number(item.basePrice || item.price || item.finalPrice || 0),
    quantity: Number(item.quantity || 1),
    options: safeOptions,
  };
}


function App() {
  const [db, setDb] = useState(() => loadDB());

  const [page, setPage] = useState("employee-login");

  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [selectedTable, setSelectedTable] = useState(null);

  const [customerType, setCustomerType] = useState("");
  const [customer, setCustomer] = useState(null);

  const [memberTel, setMemberTel] = useState("");
  const [memberMode, setMemberMode] = useState("order");

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
  });

  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [activeCategory, setActiveCategory] = useState("recommended");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuOptions, setMenuOptions] = useState({
    size: "ธรรมดา",
    topping: "",
    drinkType: "",
    sweetness: "",
    note: "",
  });

  const [cart, setCart] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSuccessTotal, setPaymentSuccessTotal] = useState(0);
  const [reviewCode, setReviewCode] = useState("");
  const [reviewCustomer, setReviewCustomer] = useState(null);
  const [remoteReviewData, setRemoteReviewData] = useState(null);

  useEffect(() => {
    saveDB(db);
  }, [db]);

  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith("/review/")) {
      const code = decodeURIComponent(path.split("/review/")[1] || "");

      if (code) {
        setReviewCode(code);
        setPage("review");
      }
    }
  }, []);


  useEffect(() => {
    async function loadReviewDataFromDB() {
      if (page !== "review" || !reviewCode) return;

      try {
        const result = await apiRequest(
          `/api/review-data/${encodeURIComponent(reviewCode)}`
        );

        if (result?.data) {
          setRemoteReviewData(result.data);
        }
      } catch (error) {
        console.warn("โหลดข้อมูลรีวิวจาก DB ไม่สำเร็จ:", error.message);
      }
    }

    loadReviewDataFromDB();
  }, [page, reviewCode]);

  useEffect(() => {
    async function syncInitialDataFromBackend() {
      try {
        const [tableRes, menuRes] = await Promise.all([
          apiRequest("/api/tables"),
          apiRequest("/api/menus"),
        ]);

        if (Array.isArray(tableRes.data)) {
          updateDB((prev) => ({
            ...prev,
            tables: Array.isArray(tableRes.data)
              ? tableRes.data.map(dbTableToUiTable)
              : prev.tables,
            menus:
          Array.isArray(menuRes.data) && menuRes.data.length > 0
            ? menuRes.data.map((dbMenu) => {
                const localMenu = menuData.find(
                  (m) =>
                    String(m.menuId || m.id).padStart(3, "0") ===
                    String(dbMenu.menuId || dbMenu.id).padStart(3, "0")
                );

                const mergedMenu = {
                  ...dbMenu,
                  name: localMenu?.name || dbMenu.name,
                  image: localMenu?.image || "",
                  description: localMenu?.description || dbMenu.description || "",
                  options: localMenu?.options || dbMenu.options || [],
                  optionType: localMenu?.optionType || dbMenu.optionType,
                };

                return normalizeMenuOptionBehavior(mergedMenu);
              })
            : prev.menus,
          }));
        }
      } catch (error) {
        console.warn("Initial backend sync failed:", error.message);
      }
    }

    syncInitialDataFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentReservations = useMemo(() => {
    if (!customer) return [];

    return (db.reservations || [])
      .filter((reservation) => {
        const reservationCustomerId =
          reservation.customerId || reservation.CId || reservation.MemberId || "";

        return String(reservationCustomerId) === String(customer.CId);
      })
      .filter((reservation) => {
        const status = String(
          reservation.status || reservation.RStatus || reservation.Status || "reserved"
        ).toLowerCase();

        return !["checked_in", "cancelled", "canceled", "paid", "done"].includes(status);
      })
      .map((reservation) => normalizeReservationFromDb(reservation));
  }, [db.reservations, customer]);


  function enrichOrderItemsWithMenuData(items) {
    return (items || []).map((item) => {
      const menuId = item.menuId || item.MenuId || item.id;
      const menu = db.menus.find(
        (m) => m.id === menuId || m.menuId === menuId || m.MenuId === menuId
      );

      const image =
        item.image ||
        item.img ||
        item.imageUrl ||
        item.menuImage ||
        item.MenuImage ||
        menu?.image ||
        menu?.img ||
        "";

      const name =
        item.name ||
        item.menuName ||
        item.MenuName ||
        menu?.name ||
        menu?.MenuName ||
        "";

      return {
        ...item,
        name,
        menuName: name,
        MenuName: name,
        image,
        img: image,
        imageUrl: image,
        menuImage: image,
        MenuImage: image,
        photo: image,
        picture: image,
      };
    });
  }

  const tableOrders = useMemo(() => {
    if (!selectedTable) return [];

    return db.orders
      .filter(
        (order) =>
          order.tableNumber === selectedTable.TNumber &&
          order.status !== "paid"
      )
      .map((order) => ({
        ...order,
        items: enrichOrderItemsWithMenuData(order.items),
      }));
  }, [db.orders, selectedTable, db.menus]);

  const cartTotal = calculateCartTotal(cart);
  const cartCount = getCartCount(cart);
  const billTotal = tableOrders.reduce((sum, order) => sum + order.total, 0);

  function updateDB(updater) {
    setDb((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveDB(next);
      return next;
    });
  }

  function resetCustomerFlow() {
    setSelectedTable(null);
    setCustomerType("");
    setCustomer(null);
    setMemberTel("");
    setMemberMode("order");

    setReservationDate("");
    setReservationTime("");
    setPeopleCount("");
    setSelectedReservation(null);

    setActiveCategory("recommended");
    setSelectedMenu(null);
    setMenuOptions({
      size: "ธรรมดา",
      topping: "",
      drinkType: "",
      sweetness: "",
      note: "",
    });

    setCart([]);
    setPaymentMethod("");
    setPaymentSuccessTotal(0);
    setReviewCode("");
    setReviewCustomer(null);
  }

  async function handleEmployeeLogin() {
    const code = employeeId.trim();

    if (!code) {
      alert("กรุณากรอกรหัสพนักงาน");
      return;
    }

    try {
      const result = await apiRequest(`/api/employees/${encodeURIComponent(code)}`);
      const foundEmployee = result.data;

      if (!foundEmployee) {
        alert("ไม่พบข้อมูลพนักงาน");
        return;
      }

      const employeeStatus = String(foundEmployee.EStatus || "").trim();

      if (
        employeeStatus &&
        employeeStatus !== "active" &&
        employeeStatus !== "กำลังทำงาน"
      ) {
        alert("พนักงานไม่ได้อยู่ในสถานะกำลังทำงาน");
        return;
      }

      setEmployee(foundEmployee);
      updateDB((prev) => {
        const exists = prev.employees.some((item) => item.EId === foundEmployee.EId);
        return {
          ...prev,
          employees: exists
            ? prev.employees.map((item) =>
                item.EId === foundEmployee.EId ? foundEmployee : item
              )
            : [...prev.employees, foundEmployee],
        };
      });
      setPage("employee-confirm");
    } catch (error) {
      console.error(error);
      alert("ไม่พบข้อมูลพนักงาน");
    }
  }

  function logoutEmployee() {
    setEmployeeId("");
    setEmployee(null);
    setShowEmployeeModal(false);

    resetCustomerFlow();

    setRegisterForm({
      firstName: "",
      lastName: "",
      tel: "",
      email: "",
    });

    setPage("employee-login");
  }

  function goCustomerType() {
    resetCustomerFlow();
    setPage("customer-type");
  }

  async function handleGeneralCustomer() {
    try {
      const result = await apiRequest("/api/customers/general", {
        method: "POST",
        body: JSON.stringify({ customerId: `G${Date.now().toString().slice(-5)}` }),
      });

      const generalCustomer = {
        CId: result.customerId,
        type: "General",
        name: "general customer",
      };

      setCustomerType("General");
      setCustomer(generalCustomer);
      setSelectedTable(null);
      setPage("service-table");
    } catch (error) {
      console.error(error);
      alert("เชื่อมต่อ backend ไม่ได้ กรุณาตรวจสอบ backend/database");
    }
  }

  function goToMemberLogin(mode) {
    setMemberMode(mode);
    setMemberTel("");
    setPage("member-login");
  }

  function goToReservationHistory() {
    setMemberMode("history");
    setMemberTel("");
    setPage("member-login");
  }

  async function handleFindMember() {
    if (!memberTel.trim()) {
      alert("กรุณากรอกเบอร์โทรสมาชิก");
      return;
    }

    try {
      const result = await apiRequest(`/api/members/by-phone/${encodeURIComponent(memberTel.trim())}`);
      const foundMember = result.data;

      setCustomerType("Member");
      setCustomer(foundMember);

      updateDB((prev) => {
        const exists = prev.members.some((member) => member.CId === foundMember.CId);
        return {
          ...prev,
          members: exists
            ? prev.members.map((member) =>
                member.CId === foundMember.CId ? foundMember : member
              )
            : [...prev.members, foundMember],
        };
      });

      if (memberMode === "reserve") {
        setPage("reservation-page");
        return;
      }

      let memberReservations = [];
      try {
        const reservationResult = await apiRequest(`/api/reservations/customer/${encodeURIComponent(foundMember.CId)}`);
        memberReservations = Array.isArray(reservationResult.data)
          ? reservationResult.data.map(normalizeReservationFromDb)
          : [];
      } catch (reservationError) {
        console.warn("Cannot load reservation history:", reservationError.message);
      }

      updateDB((prev) => ({
        ...prev,
        reservations: [
          ...prev.reservations.filter((reservation) => reservation.customerId !== foundMember.CId),
          ...memberReservations,
        ],
      }));

      if (memberMode === "history") {
        setPage("reservation-history");
        return;
      }

      setSelectedTable(null);
      setPage("service-table");
    } catch (error) {
      console.error(error);
      alert("ไม่พบสมาชิก กรุณาสมัครสมาชิกก่อน");
    }
  }

  async function handleRegisterSubmit() {
    const { firstName, lastName, tel, email } = registerForm;

    if (!firstName || !lastName || !tel || !email) {
      alert("กรุณากรอกข้อมูลสมัครสมาชิกให้ครบ");
      return;
    }

    try {
      try {
        await apiRequest(`/api/members/by-phone/${encodeURIComponent(tel.trim())}`);
        alert("เบอร์นี้สมัครสมาชิกแล้ว ระบบจะใช้ข้อมูลเดิม");
        const existingResult = await apiRequest(`/api/members/by-phone/${encodeURIComponent(tel.trim())}`);
        const existingMember = existingResult.data;
        setCustomerType("Member");
        setCustomer(existingMember);
        setPage("register-success");
        return;
      } catch (checkError) {
        // 404 = ยังไม่มีสมาชิก ใช้สมัครใหม่ได้
      }

      const result = await apiRequest("/api/members", {
        method: "POST",
        body: JSON.stringify({
          customerId: `M${Date.now().toString().slice(-5)}`,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          tel: tel.trim().slice(0, 10),
          email: email.trim(),
        }),
      });

      const newMember = result.member || {
        CId: result.customerId,
        MFirstName: firstName.trim(),
        MSurName: lastName.trim(),
        MTel: tel.trim(),
        MEmail: email.trim(),
      };

      updateDB((prev) => ({
        ...prev,
        members: [...prev.members.filter((member) => member.CId !== newMember.CId), newMember],
      }));

      setCustomerType("Member");
      setCustomer(newMember);
      setPage("register-success");
    } catch (error) {
      console.error(error);
      alert(`สมัครสมาชิกไม่สำเร็จ: ${error.message}`);
    }
  }

  function goAfterRegisterSuccess() {
    if (memberMode === "reserve") {
      setPage("reservation-page");
      return;
    }

    setSelectedTable(null);
    setPage("service-table");
  }

  async function handleSelectServiceTable(table) {
    setSelectedTable(table);

    try {
      await apiRequest(`/api/tables/${table.TNumber}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "not available" }),
      });
    } catch (error) {
      console.error(error);
      alert(`เลือกโต๊ะไม่สำเร็จ: ${error.message}`);
      return;
    }

    updateDB((prev) => ({
      ...prev,
      tables: prev.tables.map((item) => {
        if (item.TNumber !== table.TNumber) return item;

        const oldEmployeeIds = item.employeeIds || [];
        const currentEmployeeId = employee?.EId;

        const newEmployeeIds =
          currentEmployeeId && !oldEmployeeIds.includes(currentEmployeeId)
            ? [...oldEmployeeIds, currentEmployeeId]
            : oldEmployeeIds;

        return {
          ...item,
          Status: "ไม่ว่าง",
          TStatus: "not available",
          employeeId: currentEmployeeId || item.employeeId || "",
          employeeIds: newEmployeeIds,
        };
      }),
    }));

    setPage("order-food");
  }

  async function handleCreateReservation({ table, date, time, count }) {
    if (!customer) {
      alert("กรุณาเลือกสมาชิกก่อนจองโต๊ะ");
      return;
    }

    if (!date || !time || !table) {
      alert("กรุณาเลือกวันที่ เวลา และโต๊ะ");
      return;
    }

    try {
      const result = await apiRequest("/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          customerId: customer.CId,
          tableNumber: table.TNumber,
          date,
          time,
          count: Number(count) || 1,
        }),
      });

      const newReservation = {
        RId: result.reservationId,
        customerId: customer.CId,
        tableNumber: table.TNumber,
        RDate: formatReservationDate(result.date || date),
        RTime: formatReservationTime(result.time || time),
        PeopleCount: Number(result.peopleCount || count) || 1,
        status: "reserved",
        createdAt: new Date().toISOString(),
      };

      updateDB((prev) => ({
        ...prev,
        reservations: [...prev.reservations, newReservation],
      }));

      setSelectedReservation(newReservation);
      setReservationDate("");
      setReservationTime("");
      setPeopleCount("");
      setPage("reservation-success");
    } catch (error) {
      console.error(error);
      alert(`จองโต๊ะไม่สำเร็จ: ${error.message}`);
    }
  }

  async function handleCheckInReservation(reservation) {
    const table = db.tables.find(
      (item) => item.TNumber === reservation.tableNumber
    );

    const reservationMember =
      db.members.find((member) => member.CId === reservation.customerId) ||
      db.members.find((member) => member.CId === reservation.CId) ||
      customer;

    try {
      await apiRequest(`/api/tables/${reservation.tableNumber}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "not available" }),
      });
    } catch (error) {
      console.error(error);
      alert("Check-in ไม่สำเร็จ กรุณาตรวจสอบ backend/database");
      return;
    }

    updateDB((prev) => ({
      ...prev,
      reservations: prev.reservations.filter(
        (item) => String(item.RId) !== String(reservation.RId)
      ),
      tables: prev.tables.map((item) =>
        item.TNumber === reservation.tableNumber
          ? {
              ...item,
              Status: "ไม่ว่าง",
              TStatus: "not available",
              employeeId: employee?.EId || "",
            }
          : item
      ),
    }));

    setSelectedReservation({
      ...reservation,
      status: "checked_in",
    });

    if (reservationMember) {
      setCustomer(reservationMember);
      setCustomerType("Member");
      setMemberMode("order");
    }

    setSelectedTable(table || { TNumber: reservation.tableNumber });
    setPage("order-food");
  }

  async function handleCancelReservation(reservation) {
    if (reservation.status === "checked_in") {
      alert("ไม่สามารถยกเลิกได้ เพราะ Check-in แล้ว");
      return;
    }

    try {
      if (reservation.RId && !String(reservation.RId).startsWith("R")) {
        await apiRequest(`/api/reservations/${reservation.RId}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error(error);
      alert("ยกเลิกการจองไม่สำเร็จ กรุณาตรวจสอบ backend/database");
      return;
    }

    updateDB((prev) => ({
      ...prev,
      reservations: prev.reservations.map((item) =>
        item.RId === reservation.RId
          ? {
              ...item,
              status: "cancelled",
            }
          : item
      ),
    }));
  }

  function handleMenuClick(menu) {
    const normalizedMenu = normalizeMenuOptionBehavior(menu);

    if (normalizedMenu.optionType === "simple" || shouldSkipMenuDetail(normalizedMenu)) {
      addToCart(normalizedMenu, {});
      return;
    }

    setSelectedMenu(normalizedMenu);
    setMenuOptions({
      size: "ธรรมดา",
      topping: "",
      drinkType: "",
      sweetness: "",
      note: "",
    });
    setPage("menu-detail");
  }

  function addToCart(menuOrOptions, maybeOptions) {
    const looksLikeMenu =
      menuOrOptions &&
      (menuOrOptions.id ||
        menuOrOptions.menuId ||
        menuOrOptions.MenuId ||
        menuOrOptions.name ||
        menuOrOptions.MenuName ||
        menuOrOptions.price ||
        menuOrOptions.Price);

    const menu = looksLikeMenu ? menuOrOptions : selectedMenu;
    const options = looksLikeMenu ? maybeOptions || {} : menuOrOptions || {};

    if (!menu) return;

    const finalPrice = calculateItemPrice(menu, options);
    const safePrice =
      Number(finalPrice) ||
      Number(menu.price) ||
      Number(menu.Price) ||
      Number(menu.basePrice) ||
      0;

    const menuName = menu.name || menu.MenuName || menu.menuName || "";
    const menuImage = menu.image || menu.Image || menu.img || "";

    const newItem = {
      cartId: generateId("CART"),

      menuId: menu.menuId || menu.MenuId || menu.id,
      MenuId: menu.menuId || menu.MenuId || menu.id,
      id: menu.id || menu.MenuId || menu.menuId,

      name: menuName,
      menuName: menuName,
      MenuName: menuName,

      image: menuImage,
      img: menuImage,
      imageUrl: menuImage,
      menuImage: menuImage,
      MenuImage: menuImage,
      photo: menuImage,
      picture: menuImage,

      price: safePrice,
      finalPrice: safePrice,
      unitPrice: safePrice,
      UnitPrice: safePrice,
      basePrice: menu.price || menu.Price || safePrice,

      options: options || {},
      quantity: 1,
      total: safePrice,
      subtotal: safePrice,
      SubTotal: safePrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedMenu(null);
    setPage("order-food");
  }

  function increaseCartItem(cartId) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId !== cartId) return item;

        const nextQuantity = item.quantity + 1;
        const itemPrice = item.finalPrice || item.price || item.unitPrice || item.UnitPrice || 0;

        return {
          ...item,
          quantity: nextQuantity,
          total: itemPrice * nextQuantity,
          subtotal: itemPrice * nextQuantity,
          SubTotal: itemPrice * nextQuantity,
        };
      })
    );
  }

  function decreaseCartItem(cartId) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId !== cartId) return item;

          const nextQuantity = item.quantity - 1;
          const itemPrice = item.finalPrice || item.price || item.unitPrice || item.UnitPrice || 0;

          return {
            ...item,
            quantity: nextQuantity,
            total: itemPrice * nextQuantity,
            subtotal: itemPrice * nextQuantity,
            SubTotal: itemPrice * nextQuantity,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeCartItem(cartId) {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }

  async function confirmOrder() {
    if (cart.length === 0) {
      alert("ยังไม่มีรายการในตะกร้า");
      return;
    }

    if (!selectedTable) {
      alert("กรุณาเลือกโต๊ะก่อน");
      return;
    }

    const selectedTableFromDB = db.tables.find(
      (table) => table.TNumber === selectedTable.TNumber
    );

    const tableEmployeeIds = selectedTableFromDB?.employeeIds || [];

    const finalEmployeeIds =
      employee?.EId && !tableEmployeeIds.includes(employee.EId)
        ? [...tableEmployeeIds, employee.EId]
        : tableEmployeeIds;

    try {
      const safeCartItems = cart.map(sanitizeCartItemForApi);

      const result = await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customerId: customer?.CId || "G00001",
          employeeId: employee?.EId || "E123456",
          tableNumber: selectedTable.TNumber,
          items: enrichOrderItemsWithMenuData(safeCartItems),
        }),
      });

      const newOrder = {
        orderId: result.orderId,
        tableNumber: selectedTable.TNumber,
        customerId: customer?.CId || "",
        customerType,
        employeeId: employee?.EId || "",
        employeeIds: finalEmployeeIds,
        items: enrichOrderItemsWithMenuData(safeCartItems),
        total: cartTotal,
        status: "ordered",
        createdAt: new Date().toISOString(),
      };

      updateDB((prev) => ({
        ...prev,
        orders: [...prev.orders, newOrder],
        tables: prev.tables.map((table) =>
          table.TNumber === selectedTable.TNumber
            ? {
                ...table,
                Status: "ไม่ว่าง",
                TStatus: "not available",
                employeeId: employee?.EId || table.employeeId || "",
                employeeIds: finalEmployeeIds,
              }
            : table
        ),
      }));

      setCart([]);
      setPage("order-success");
    } catch (error) {
      console.error(error);
      alert(`ยืนยันคำสั่งซื้อไม่สำเร็จ: ${error.message}`);
    }
  }

  function handleSelectPayment(method) {
    if (tableOrders.length === 0) {
      alert("ยังไม่มีรายการอาหารในบิล");
      return;
    }

    setPaymentMethod(method);
    setPage("payment-summary");
  }

  function getMemberCustomerFromOrders(currentOrders = []) {
    const possibleCustomerIds = [
      customer?.CId,
      customer?.cid,
      customer?.id,
      selectedReservation?.customerId,
      selectedReservation?.CId,
      ...(currentOrders || []).map(
        (order) => order.customerId || order.CId || order.customer?.CId || ""
      ),
    ]
      .filter(Boolean)
      .map((id) => String(id));

    const memberId = possibleCustomerIds.find((id) => id.startsWith("M"));

    const reservationMember =
      selectedReservation?.customerId || selectedReservation?.CId
        ? db.members.find(
            (member) =>
              member.CId === selectedReservation.customerId ||
              member.CId === selectedReservation.CId
          )
        : null;

    const orderMember = memberId
      ? db.members.find((member) => String(member.CId) === memberId)
      : null;

    return {
      memberCustomer: customer || reservationMember || orderMember || null,
      memberId,
      isMemberCustomer:
        String(customerType || "").toLowerCase() === "member" ||
        String(customerType || "") === "Member" ||
        Boolean(memberId) ||
        String(customer?.CId || "").startsWith("M") ||
        Boolean(customer?.MFirstName || customer?.MTel || customer?.MEmail) ||
        Boolean(reservationMember) ||
        Boolean(orderMember),
    };
  }

  // ✅ FIX: createReviewSession ปิด } ถูกที่ และ flatten employeeIds จากทุก order
  function createReviewSession(currentOrders) {
    const { memberCustomer, memberId, isMemberCustomer } =
      getMemberCustomerFromOrders(currentOrders);

    if (!isMemberCustomer || currentOrders.length === 0) {
      return "";
    }

    const reviewCustomerData =
      memberCustomer ||
      (memberId ? { CId: memberId } : null) ||
      customer ||
      null;

    setReviewCustomer(reviewCustomerData);

    const orderIds = [
      ...new Set(
        currentOrders
          .map((order) => order.orderId || order.OId || "")
          .filter(Boolean)
      ),
    ];

    // ✅ FIX: รวม employeeIds จากทุก order (รองรับหลายออเดอร์ + เปลี่ยนพนักงาน)
    const employeeIds = [
      ...new Set(
        currentOrders
          .flatMap((order) => [
            ...(Array.isArray(order.employeeIds) ? order.employeeIds : []),
            order.employeeId || "",
          ])
          .filter(Boolean)
      ),
    ];

    const newReviewCode = btoa(JSON.stringify({ orderIds, employeeIds }));

    // ✅ save session ลง db ให้ getReviewSessionData() หาเจอ
    updateDB((prev) => ({
      ...prev,
      reviewSessions: [
        ...(prev.reviewSessions || []).filter((s) => s.reviewCode !== newReviewCode),
        {
          reviewCode: newReviewCode,
          customerId: reviewCustomerData?.CId || memberId || "",
          orderIds,
          employeeIds,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    return newReviewCode;
  } // ✅ ปิด createReviewSession ตรงนี้

  async function confirmPayment() {
    const currentOrders = tableOrders;
    const realTotal = currentOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    if (currentOrders.length === 0) {
      alert("ยังไม่มีรายการอาหารในบิล");
      return;
    }

    if (realTotal <= 0) {
      alert("ยอดรวมไม่ถูกต้อง กรุณาตรวจสอบบิล");
      return;
    }

    try {
      for (const order of currentOrders) {
        await apiRequest("/api/payments", {
          method: "POST",
          body: JSON.stringify({
            orderId: order.orderId,
            method: uiPaymentToDb(paymentMethod),
            tableNumber: selectedTable?.TNumber || "",
            total: order.total || realTotal,
          }),
        });
      }
    } catch (error) {
      console.error(error);
      alert("ชำระเงินไม่สำเร็จ กรุณาตรวจสอบ backend/database");
      return;
    }

    setPaymentSuccessTotal(realTotal);

    const payment = {
      paymentId: generateId("P"),
      tableNumber: selectedTable?.TNumber || "",
      customerId: customer?.CId || selectedReservation?.customerId || "",
      employeeId: employee?.EId || "",
      method: paymentMethod,
      total: realTotal,
      status: "paid",
      createdAt: new Date().toISOString(),
      orderIds: currentOrders.map((order) => order.orderId),
    };

    const { isMemberCustomer } = getMemberCustomerFromOrders(currentOrders);

    if (isMemberCustomer && currentOrders.length > 0) {
      const newReviewCode = createReviewSession(currentOrders);
      setReviewCode(newReviewCode);
      setRemoteReviewData(null);
    } else {
      setReviewCode("");
      setRemoteReviewData(null);
    }

    updateDB((prev) => ({
      ...prev,
      payments: [...prev.payments, payment],
      orders: prev.orders.map((order) =>
        order.tableNumber === selectedTable?.TNumber && order.status !== "paid"
          ? {
              ...order,
              status: "paid",
            }
          : order
      ),
      tables: prev.tables.map((table) =>
        table.TNumber === selectedTable?.TNumber
          ? {
              ...table,
              Status: "ว่าง",
              TStatus: "available",
              employeeId: "",
              employeeIds: [],
              servingEmployees: [],
              employees: [],
              staffIds: [],
              staff: [],
              EId: "",
              currentEmployeeId: "",
              servedBy: "",
            }
          : table
      ),
    }));

    setCart([]);
    setPage("payment-success");
  }

  async function clearTable() {
    if (!selectedTable) {
      setPage("customer-type");
      return;
    }

    try {
      await apiRequest(`/api/tables/${selectedTable.TNumber}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "available" }),
      });
    } catch (error) {
      console.error(error);
    }

    updateDB((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.TNumber === selectedTable.TNumber
          ? {
              ...table,
              Status: "ว่าง",
              TStatus: "available",
              employeeId: "",
            }
          : table
      ),
    }));

    resetCustomerFlow();
    setPage("customer-type");
  }

  function getReviewSessionData() {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get("data");

    if (payload) {
      try {
        const decodedText = decodeURIComponent(
          Array.prototype.map
            .call(atob(payload), (char) => {
              return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const decodedPayload = JSON.parse(decodedText);

        if (decodedPayload) {
          return decodedPayload;
        }
      } catch (error) {
        console.error("decode review payload error:", error);
      }
    }

    const thaiMenuMap = {
      "001": "ข้าวผัดหมู",
      "002": "ข้าวผัดไก่",
      "003": "ข้าวผัดหมึก",
      "004": "ข้าวผัดกุ้ง",
      "005": "ข้าวผัดรวมมิตร",
      "006": "ชีสบอล",
      "007": "ขนมปังอบไอน้ำ",
      "008": "สละลอยแก้ว",
      "009": "เฉาก๊วย",
      "010": "พานาคอตต้า",
      "011": "มอคค่า",
      "012": "มัทฉะลาเต้",
      "013": "ชามะลิ",
      "014": "ชาดำ",
      "015": "นมสด",
      "016": "ข้าวผัดกะเพราหมูสับ",
      "017": "ข้าวผัดกะเพราไก่",
      "018": "ข้าวผัดกะเพราหมึก",
      "019": "ข้าวผัดกะเพรากุ้ง",
      "020": "ข้าวผัดกะเพราทะเล",
      "021": "ข้าวผัดหมู",
      "022": "ข้าวผัดไก่",
      "023": "ข้าวผัดหมึก",
      "024": "ข้าวผัดกุ้ง",
      "025": "ข้าวผัดรวมมิตร",
      "026": "ข้าวไก่กรอบซอสเกาหลี",
      "027": "ข้าวไข่เจียวหมูสับ",
      "028": "สุกี้แห้ง",
      "029": "สุกี้น้ำ",
      "030": "ข้าวหมูกระเทียม",
      "031": "เฟรนช์ฟรายส์",
      "032": "ไก่ป๊อป",
      "033": "กุ้งชุบแป้งทอด",
      "034": "เอ็นไก่ทอด",
      "035": "นักเก็ต",
      "036": "ชีสบอล",
      "037": "ขนมปังอบไอน้ำ",
      "038": "สละลอยแก้ว",
      "039": "เฉาก๊วย",
      "040": "พานาคอตต้า",
      "041": "บราวนี่",
      "042": "ไอศกรีมช็อกโกแลต",
      "043": "ไอศกรีมมะนาว",
      "044": "ไอศกรีมสตรอว์เบอร์รี",
      "045": "ไอศกรีมวานิลลา",
      "046": "น้ำเปล่า",
      "047": "น้ำส้มคั้นสด",
      "048": "น้ำมะนาว",
      "049": "เป๊ปซี่",
      "050": "ชามะนาว",
      "051": "ชาไทย",
      "052": "เอสเปรสโซ",
      "053": "ลาเต้",
      "054": "อเมริกาโน่",
      "055": "โกโก้",
      "056": "มอคค่า",
      "057": "มัทฉะลาเต้",
      "058": "ชามะลิ",
      "059": "ชาดำ",
      "060": "นมสด",
    };

    const imageCandidates = (menuId, name) => {
      const id = String(menuId || "").padStart(3, "0");
      const safeName = String(name || "").trim();
      return [
        `/image/${id}.png`,
        `/image/${id}.jpg`,
        `/image/${id}.jpeg`,
        `/image/menu/${id}.png`,
        `/image/menu/${id}.jpg`,
        `/image/menu/${id}.jpeg`,
        `/image/menus/${id}.png`,
        `/image/menus/${id}.jpg`,
        `/image/menus/${id}.jpeg`,
        safeName ? `/image/${safeName}.png` : "",
        safeName ? `/image/${safeName}.jpg` : "",
      ].filter(Boolean);
    };

    const normalizeMenus = (rawMenus = []) => {
      return rawMenus.map((item) => {
        const rawMenuId =
          item.menuId ||
          item.MenuId ||
          item.id ||
          item?.menu?.menuId ||
          item?.menu?.MenuId ||
          "";

        const menuId = String(rawMenuId || "").replace(/\D/g, "").padStart(3, "0") || rawMenuId;

        const localMenu = db.menus.find(
          (m) =>
            String(m.id || m.menuId || m.MenuId || "").replace(/\D/g, "").padStart(3, "0") ===
            String(menuId || "").replace(/\D/g, "").padStart(3, "0")
        );

        const menuName =
          localMenu?.name ||
          localMenu?.MenuName ||
          localMenu?.menuName ||
          thaiMenuMap[menuId] ||
          item.menuNameTH ||
          item.MenuNameTH ||
          item.menuName ||
          item.MenuName ||
          item.nameTH ||
          item.name ||
          "ไม่ระบุชื่อเมนู";

        // ✅ FIX: ดึง URL รูปจาก menuData (local) เพราะ db.menus ไม่มี URL
        const menuDataItem = menuData.find(
          (m) =>
            String(m.id || "").padStart(3, "0") ===
            String(menuId || "").replace(/\D/g, "").padStart(3, "0")
        );

        const localImage =
          menuDataItem?.image ||
          localMenu?.image ||
          localMenu?.img ||
          localMenu?.imageUrl ||
          localMenu?.menuImage ||
          localMenu?.MenuImage ||
          "";

        const image =
          localImage ||
          item.image ||
          item.img ||
          item.imageUrl ||
          item.menuImage ||
          item.MenuImage ||
          "";

        return {
          menuId,
          menuName,
          name: menuName,
          MenuName: menuName,
          image,
          imageCandidates: imageCandidates(menuId, menuName),
          quantity: item.quantity || item.Quantity || 1,
          orderId: item.orderId || item.OId || "",
        };
      });
    };

    if (remoteReviewData) {
      const rawMenus =
        Array.isArray(remoteReviewData.menus) && remoteReviewData.menus.length > 0
          ? remoteReviewData.menus
          : (remoteReviewData.orders || []).flatMap((order) =>
              (order.items || []).map((item) => ({
                ...item,
                orderId: item.orderId || order.orderId || order.OId || "",
              }))
            );

      return {
        session: remoteReviewData.session || null,
        customer: remoteReviewData.customer || null,
        employees: remoteReviewData.employees || [],
        menus: normalizeMenus(rawMenus),
        experienceTopics:
          remoteReviewData.experienceTopics || [
            { id: "cleanliness", name: "ความสะอาด" },
            { id: "speed", name: "ความรวดเร็ว" },
            { id: "overall", name: "ความพึงพอใจโดยรวม" },
          ],
      };
    }

    const session = db.reviewSessions?.find(
      (item) => item.reviewCode === reviewCode
    );

    if (!session) return null;

    const reviewCustomerData = db.members.find(
      (member) => member.CId === session.customerId
    );

    const reviewEmployees = db.employees.filter((employeeItem) =>
      session.employeeIds?.includes(employeeItem.EId)
    );

    const reviewOrders = db.orders.filter((order) =>
      session.orderIds?.includes(order.orderId)
    );

    const rawMenus = reviewOrders.flatMap((order) =>
      enrichOrderItemsWithMenuData(order.items || []).map((item) => ({
        ...item,
        orderId: order.orderId,
      }))
    );

    return {
      session,
      customer: reviewCustomerData,
      employees: reviewEmployees,
      menus: normalizeMenus(rawMenus),
      experienceTopics: [
        { id: "cleanliness", name: "ความสะอาด" },
        { id: "speed", name: "ความรวดเร็ว" },
        { id: "overall", name: "ความพึงพอใจโดยรวม" },
      ],
    };
  }

  async function submitReview(reviewPayload) {
    const reviewData = getReviewSessionData();
    const session =
      reviewData?.session ||
      db.reviewSessions?.find((item) => item.reviewCode === reviewCode);

    const orderIds = [
      ...new Set(
        (
          session?.orderIds ||
          String(reviewCode || "")
            .split(",")
            .map((item) => item.trim())
        ).filter(Boolean)
      ),
    ];

    const employeeIds = [
      ...new Set(
        (
          session?.employeeIds ||
          (reviewData?.employees || []).map((employeeItem) => employeeItem.EId)
        ).filter(Boolean)
      ),
    ];

    const averageValues = (obj) => {
      const values = Object.values(obj || {})
        .map(Number)
        .filter((value) => value > 0);

      if (!values.length) return 5;

      return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    };

    const orderRating =
      Number(reviewPayload.orderRating) ||
      Number(reviewPayload.foodRating) ||
      averageValues(reviewPayload.foodRatings) ||
      Number(reviewPayload.rating) ||
      5;

    const employeeRating =
      Number(reviewPayload.employeeRating) ||
      Number(reviewPayload.serviceRating) ||
      averageValues(reviewPayload.employeeRatings) ||
      Number(reviewPayload.rating) ||
      5;

    const safeComment = String(
      reviewPayload.orderComment ||
      reviewPayload.foodComment ||
      reviewPayload.employeeComment ||
      reviewPayload.serviceComment ||
      reviewPayload.comment ||
      ""
    ).slice(0, 100);

    try {
      if (orderIds.length === 0) {
        throw new Error("ไม่พบ Order ID สำหรับบันทึกรีวิว");
      }

      for (const orderId of orderIds) {
        await apiRequest("/api/reviews/order", {
          method: "POST",
          body: JSON.stringify({
            orderId,
            OId: orderId,
            rating: orderRating,
            Rating: orderRating,
            comment: safeComment,
            Comment: safeComment,
          }),
        });
      }

      for (const empId of employeeIds) {
        if (!empId) continue;

        await apiRequest("/api/reviews/employee", {
          method: "POST",
          body: JSON.stringify({
            employeeId: empId,
            EId: empId,
            rating: employeeRating,
            Rating: employeeRating,
            comment: safeComment,
            Comment: safeComment,
          }),
        });
      }
    } catch (error) {
      console.error("Review API error:", error);
      alert(`บันทึกรีวิวลง DB ไม่สำเร็จ: ${error.message}`);
      return;
    }

    updateDB((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          reviewId: generateId("REVIEW"),
          reviewCode,
          ...reviewPayload,
          createdAt: new Date().toISOString(),
        },
      ],
      reviewSessions: (prev.reviewSessions || []).map((item) =>
        item.reviewCode === reviewCode
          ? {
              ...item,
              status: "submitted",
              submittedAt: new Date().toISOString(),
            }
          : item
      ),
    }));

    const member =
      reviewData?.customer ||
      db.members.find((item) => item.CId === session?.customerId);

    setReviewCustomer(member || null);
    setPage("thank-you");
  }

  const showHeader =
    employee &&
    ![
      "employee-login",
      "employee-confirm",
      "employee-success",
      "review",
      "thank-you",
    ].includes(page);

 const reviewSessionData = getReviewSessionData();

const reviewPayloadParam =
  reviewCode && reviewSessionData
    ? encodeURIComponent(
        btoa(
          encodeURIComponent(JSON.stringify(reviewSessionData)).replace(
            /%([0-9A-F]{2})/g,
            (match, p1) => String.fromCharCode("0x" + p1)
          )
        )
      )
    : "";

const reviewLink = reviewCode
  ? `${window.location.origin}/review/${encodeURIComponent(reviewCode)}`
  : "";

return (
    <>
      {showHeader && (
        <Header
          employee={employee}
          selectedTable={selectedTable}
          cartCount={cartCount}
          onEmployeeClick={() => setShowEmployeeModal(true)}
          onSelectTable={() => setPage("service-table")}
          onCartClick={() => setPage("cart")}
          onBillClick={() => setPage("bill")}
        />
      )}

      {showEmployeeModal && (
        <EmployeeModal
          employee={employee}
          onClose={() => setShowEmployeeModal(false)}
          onLogout={logoutEmployee}
        />
      )}

      {page === "employee-login" && (
        <EmployeeLogin
          employeeId={employeeId}
          setEmployeeId={setEmployeeId}
          onLogin={handleEmployeeLogin}
        />
      )}

      {page === "employee-confirm" && (
        <EmployeeConfirm
          employee={employee}
          onConfirm={() => setPage("employee-success")}
          onLogout={logoutEmployee}
        />
      )}

      {page === "employee-success" && (
        <EmployeeSuccess
          employee={employee}
          onNext={() => setPage("customer-type")}
          onLogout={logoutEmployee}
        />
      )}

      {page === "customer-type" && (
        <CustomerType
          onGeneral={handleGeneralCustomer}
          onMember={() => goToMemberLogin("order")}
          onReserve={() => goToMemberLogin("reserve")}
          onReservationHistory={goToReservationHistory}
          onHistory={goToReservationHistory}
          onReservationHistoryClick={goToReservationHistory}
          onClickHistory={goToReservationHistory}
        />
      )}

      {page === "service-table" && (
        <ServiceTable
          tables={db.tables}
          onTableClick={handleSelectServiceTable}
        />
      )}

      {page === "member-login" && (
        <MemberLogin
          memberTel={memberTel}
          setMemberTel={setMemberTel}
          memberMode={memberMode}
          onSubmit={handleFindMember}
          onRegister={() => setPage("member-register")}
        />
      )}

      {page === "member-register" && (
        <MemberRegister
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          onSubmit={handleRegisterSubmit}
          onBack={() => setPage("member-login")}
        />
      )}

      {page === "register-success" && (
        <RegisterSuccess
          customer={customer}
          memberMode={memberMode}
          onNext={goAfterRegisterSuccess}
        />
      )}

      {page === "reservation-page" && (
        <ReservationPage
          customer={customer}
          tables={db.tables}
          reservations={db.reservations}
          reservationDate={reservationDate}
          setReservationDate={setReservationDate}
          reservationTime={reservationTime}
          setReservationTime={setReservationTime}
          peopleCount={peopleCount}
          setPeopleCount={setPeopleCount}
          onCreateReservation={handleCreateReservation}
          onHistory={goToReservationHistory}
          onReservationHistory={goToReservationHistory}
        />
      )}

      {page === "reservation-success" && (
        <ReservationSuccess
          customer={customer}
          reservation={selectedReservation}
          onHome={goCustomerType}
          onHistory={() => setPage("reservation-history")}
        />
      )}

      {page === "reservation-history" && (
        <ReservationHistory
          customer={customer}
          reservations={currentReservations}
          onCheckIn={handleCheckInReservation}
          onCancel={handleCancelReservation}
          onBack={goCustomerType}
          isToday={isToday}
        />
      )}

      {page === "order-food" && (
        <OrderFood
          menus={db.menus}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onMenuClick={handleMenuClick}
        />
      )}

      {page === "menu-detail" && (
        <MenuDetail
          selectedMenu={selectedMenu}
          menuOptions={menuOptions}
          setMenuOptions={setMenuOptions}
          onAddToCart={addToCart}
          onBack={() => setPage("order-food")}
        />
      )}

      {page === "cart" && (
        <Cart
          cart={cart}
          cartTotal={cartTotal}
          onBack={() => setPage("order-food")}
          onConfirmOrder={confirmOrder}
          onIncrease={increaseCartItem}
          onDecrease={decreaseCartItem}
          onRemove={removeCartItem}
        />
      )}

      {page === "order-success" && (
        <OrderSuccess
          onBackToOrder={() => setPage("order-food")}
          onGoBill={() => setPage("bill")}
        />
      )}

      {page === "bill" && (
        <Bill
          tableOrders={tableOrders}
          billTotal={billTotal}
          onBack={() => setPage("order-food")}
          onSelectPayment={handleSelectPayment}
        />
      )}

      {page === "payment-summary" && (
        <PaymentSummary
          tableOrders={tableOrders}
          billTotal={billTotal}
          paymentMethod={paymentMethod}
          selectedTable={selectedTable}
          customer={customer}
          onBack={() => setPage("bill")}
          onConfirmPayment={confirmPayment}
        />
      )}

      {page === "payment-success" && (
        <PaymentSuccess
          paymentMethod={paymentMethod}
          total={paymentSuccessTotal || billTotal}
          reviewCode={reviewCode}
          reviewUrl={reviewLink}
          qrValue={reviewLink}
          onClearTable={clearTable}
          onGoReview={() => setPage("review")}
        />
      )}

      {page === "review" && (
        <div className="review-mobile-fix">
          <style>
            {`
              .review-mobile-fix img {
                max-width: 140px !important;
                max-height: 120px !important;
                width: 140px !important;
                height: 120px !important;
                object-fit: cover !important;
                border-radius: 12px !important;
              }

              .review-mobile-fix {
                overflow-x: hidden !important;
              }

              .review-mobile-fix * {
                box-sizing: border-box !important;
              }

              @media (max-width: 768px) {
                .review-mobile-fix img {
                  max-width: 96px !important;
                  max-height: 80px !important;
                  width: 96px !important;
                  height: 80px !important;
                }
              }
            `}
          </style>
          {reviewSessionData ? (
            <ReviewPage
              reviewData={reviewSessionData}
              onSubmit={submitReview}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", border: "4px solid #e5e7eb", borderTop: "4px solid #f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "#6b7280", fontSize: "16px" }}>กำลังโหลดข้อมูลรีวิว...</p>
            </div>
          )}
        </div>
      )}

      {page === "thank-you" && (
        <ThankYou customer={reviewCustomer} />
      )}
    </>
  );
}

export default App;
