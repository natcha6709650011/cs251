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

const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : `http://${window.location.hostname}:4000`;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || `API error ${response.status}`);
  }

  return data;
}

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

function uiPaymentToDb(method) {
  const map = {
    "เงินสด": "Cash",
    "สแกนคิวอาร์โค้ด": "Qr Code",
    "บัตรเครดิต/เดบิต": "Credit Card",
    Cash: "Cash",
    "Qr Code": "Qr Code",
    "QR Code": "Qr Code",
    "Credit Card": "Credit Card",
  };

  return map[method] || method || "Cash";
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
    async function loadRemoteReviewSession() {
      if (page !== "review" || !reviewCode) return;

      try {
        const result = await apiRequest(`/api/review-sessions/${encodeURIComponent(reviewCode)}`);
        if (result?.data) {
          setRemoteReviewData(result.data);
        }
      } catch (error) {
        console.warn("Remote review session not found:", error.message);
      }
    }

    loadRemoteReviewSession();
  }, [page, reviewCode]);

  useEffect(() => {
    async function syncInitialDataFromBackend() {
      try {
        const [tableRes] = await Promise.all([
          apiRequest("/api/tables"),
        ]);

        if (Array.isArray(tableRes.data)) {
          updateDB((prev) => ({
            ...prev,
            tables: tableRes.data.map(dbTableToUiTable),
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

    return db.reservations.filter(
      (reservation) => reservation.customerId === customer.CId
    );
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

      if (foundEmployee.EStatus && foundEmployee.EStatus !== "active") {
        alert("พนักงานไม่ได้อยู่ในสถานะ active");
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
          ? reservationResult.data.map((item) => ({
              RId: item.RId,
              customerId: item.CId,
              tableNumber: item.TNumber,
              RDate: typeof item.RDate === "string" ? item.RDate.slice(0, 10) : item.RDate,
              RTime: typeof item.RTime === "string" ? item.RTime.slice(0, 5) : item.RTime,
              PeopleCount: item.PeopleCount || 1,
              status: item.status || "reserved",
            }))
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

      // กดปุ่ม Member = ต้องไปหน้าเลือกโต๊ะ/สั่งอาหารเสมอ
      // ไม่ auto เด้งไปประวัติการจอง ถึงแม้สมาชิกจะเคยมี reservation
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
        RDate: date,
        RTime: time,
        PeopleCount: Number(count) || 1,
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
      reservations: prev.reservations.map((item) =>
        item.RId === reservation.RId
          ? {
              ...item,
              status: "checked_in",
            }
          : item
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
    if (menu.optionType === "simple") {
      addToCart(menu, {});
      return;
    }

    setSelectedMenu(menu);
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
    // รองรับทั้ง 2 แบบ:
    // 1) simple menu เรียก addToCart(menu, {})
    // 2) menu-detail บาง component เรียก addToCart(options) โดยไม่ได้ส่ง selectedMenu มา
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

      // menu id aliases
      menuId: menu.menuId || menu.MenuId || menu.id,
      MenuId: menu.menuId || menu.MenuId || menu.id,
      id: menu.id || menu.MenuId || menu.menuId,

      // name aliases: กัน Cart component เรียกคนละชื่อ
      name: menuName,
      menuName: menuName,
      MenuName: menuName,

      // image aliases
      image: menuImage,
      img: menuImage,
      imageUrl: menuImage,
      menuImage: menuImage,
      MenuImage: menuImage,
      photo: menuImage,
      picture: menuImage,

      // price aliases
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

  function createReviewSession(currentOrders) {
    const isMemberCustomer =
    customerType === "Member" ||
    String(customer?.CId || "").startsWith("M") ||
    Boolean(customer?.MFirstName || customer?.MTel);

if (!customer || !isMemberCustomer) return "";

    const code = generateId("RV");

    const employeeIds = [
  ...new Set([
    ...currentOrders.flatMap((order) =>
      order.employeeIds?.length ? order.employeeIds : [order.employeeId]
    ),
    employee?.EId,
  ]),
].filter(Boolean);

    const reviewOrders = currentOrders.map((order) => ({
      orderId: order.orderId,
      items: enrichOrderItemsWithMenuData(order.items || []).map((item) => ({
        menuId: item.menuId || item.MenuId || item.id || "",
        menuName: item.name || item.menuName || item.MenuName || "",
        image: item.image || item.img || item.imageUrl || item.menuImage || "",
        quantity: item.quantity || 1,
        orderId: order.orderId,
      })),
    }));

    const reviewData = {
      session: {
        reviewCode: code,
        customerId: customer.CId,
        tableNumber: selectedTable?.TNumber || "",
        orderIds: currentOrders.map((order) => order.orderId),
        employeeIds,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      customer: {
        CId: customer.CId,
        MFirstName: customer.MFirstName || customer.firstName || "",
        MSurName: customer.MSurName || customer.lastName || "",
        MTel: customer.MTel || customer.tel || "",
        MEmail: customer.MEmail || customer.email || "",
      },
      employees: db.employees.filter((employeeItem) =>
        employeeIds.includes(employeeItem.EId)
      ),
      orders: reviewOrders,
      experienceTopics: db.experienceTopics,
    };

    const newReviewSession = {
      reviewCode: code,
      customerId: customer.CId,
      tableNumber: selectedTable?.TNumber || "",
      orderIds: currentOrders.map((order) => order.orderId),
      employeeIds,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    updateDB((prev) => ({
      ...prev,
      reviewSessions: [...prev.reviewSessions, newReviewSession],
    }));

    // สำคัญ: เก็บข้อมูล review ไว้ที่ backend เพื่อให้มือถืออีกเครื่องสแกน QR แล้วดึงได้
    apiRequest("/api/review-sessions", {
      method: "POST",
      body: JSON.stringify({
        code,
        data: reviewData,
      }),
    }).catch((error) => {
      console.warn("Save review session failed:", error.message);
    });

    return code;
  }

  async function confirmPayment() {
    const currentOrders = tableOrders;

    if (currentOrders.length === 0) {
      alert("ยังไม่มีรายการอาหารในบิล");
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
            total: order.total || billTotal,
          }),
        });
      }
    } catch (error) {
      console.error(error);
      alert("ชำระเงินไม่สำเร็จ กรุณาตรวจสอบ backend/database");
      return;
    }

    const payment = {
      paymentId: generateId("P"),
      tableNumber: selectedTable?.TNumber || "",
      customerId: customer?.CId || "",
      employeeId: employee?.EId || "",
      method: paymentMethod,
      total: billTotal,
      status: "paid",
      createdAt: new Date().toISOString(),
      orderIds: currentOrders.map((order) => order.orderId),
    };

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

const isMemberCustomer =
  customerType === "Member" ||
  String(customer?.CId || "").startsWith("M") ||
  Boolean(customer?.MFirstName || customer?.MTel);

const memberCustomer =
  customer ||
  db.members.find((member) => String(member.CId || "").startsWith("M"));

const shouldShowReviewQR =
  String(memberCustomer?.CId || "").startsWith("M") ||
  Boolean(memberCustomer?.MFirstName || memberCustomer?.MTel);

if (shouldShowReviewQR) {
  const oldCustomer = customer;

  if (!customer && memberCustomer) {
    setCustomer(memberCustomer);
  }

  const newReviewCode = createReviewSession(currentOrders);

  if (newReviewCode) {
    setReviewCode(newReviewCode);
  } else {
    const fallbackCode = generateId("RV");

    const employeeIds = [
      ...new Set([
        ...currentOrders.flatMap((order) =>
          order.employeeIds?.length ? order.employeeIds : [order.employeeId]
        ),
        employee?.EId,
      ]),
    ].filter(Boolean);

    const reviewData = {
      session: {
        reviewCode: fallbackCode,
        customerId: memberCustomer?.CId,
        tableNumber: selectedTable?.TNumber || "",
        orderIds: currentOrders.map((order) => order.orderId),
        employeeIds,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      customer: memberCustomer,
      employees: db.employees.filter((emp) => employeeIds.includes(emp.EId)),
      orders: currentOrders.map((order) => ({
        orderId: order.orderId,
        items: enrichOrderItemsWithMenuData(order.items || []).map((item) => ({
          menuId: item.menuId || item.MenuId || item.id || "",
          menuName: item.name || item.menuName || item.MenuName || "",
          image: item.image || item.img || item.imageUrl || item.menuImage || "",
          quantity: item.quantity || 1,
          orderId: order.orderId,
        })),
      })),
      experienceTopics: db.experienceTopics,
    };

    apiRequest("/api/review-sessions", {
      method: "POST",
      body: JSON.stringify({
        code: fallbackCode,
        data: reviewData,
      }),
    }).catch((error) => {
      console.warn("Save fallback review session failed:", error.message);
    });

    setReviewCode(fallbackCode);
  }
} else {
  setReviewCode("");
}

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
    if (remoteReviewData) {
      const menus = (remoteReviewData.orders || []).flatMap((order) =>
        (order.items || []).map((item) => ({
          menuId: item.menuId,
          menuName: item.menuName || item.name || "",
          image: item.image || item.img || item.imageUrl || "",
          quantity: item.quantity || 1,
          orderId: item.orderId || order.orderId,
        }))
      );

      return {
        session: remoteReviewData.session,
        customer: remoteReviewData.customer,
        employees: remoteReviewData.employees || [],
        menus,
        experienceTopics: remoteReviewData.experienceTopics || db.experienceTopics,
      };
    }

    const session = db.reviewSessions.find(
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

    const menus = reviewOrders.flatMap((order) =>
      enrichOrderItemsWithMenuData(order.items || []).map((item) => ({
        menuId: item.menuId || item.MenuId || item.id,
        menuName: item.name || item.menuName || item.MenuName,
        image: item.image || item.img || item.imageUrl || item.menuImage,
        quantity: item.quantity,
        orderId: order.orderId,
      }))
    );

    return {
      session,
      customer: reviewCustomerData,
      employees: reviewEmployees,
      menus,
      experienceTopics: db.experienceTopics,
    };
  }

  async function submitReview(reviewPayload) {
    const reviewData = getReviewSessionData();
    const session =
      reviewData?.session ||
      db.reviewSessions.find((item) => item.reviewCode === reviewCode);

    try {
      const firstOrderId = session?.orderIds?.[0];
      if (firstOrderId) {
        await apiRequest("/api/reviews/order", {
          method: "POST",
          body: JSON.stringify({
            orderId: firstOrderId,
            rating: reviewPayload.orderRating || reviewPayload.foodRating || reviewPayload.rating || 5,
            comment: reviewPayload.orderComment || reviewPayload.foodComment || reviewPayload.comment || "",
          }),
        });
      }

      const employeeIds = session?.employeeIds || [];
      for (const empId of employeeIds) {
        if (!empId) continue;

        await apiRequest("/api/reviews/employee", {
          method: "POST",
          body: JSON.stringify({
            employeeId: empId,
            rating: reviewPayload.employeeRating || reviewPayload.serviceRating || reviewPayload.rating || 5,
            comment: reviewPayload.employeeComment || reviewPayload.serviceComment || reviewPayload.comment || "",
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
      reviewSessions: prev.reviewSessions.map((item) =>
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

{page === "payment-success" &&
  (() => {
    const finalReviewUrl = reviewCode
      ? `${window.location.origin}/review/${encodeURIComponent(reviewCode)}`
      : "";

    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#f7f1e8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 16px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "min(92vw, 520px)",
            background: "#fff",
            border: "2px solid #222",
            borderRadius: "28px",
            padding: "32px 24px",
            textAlign: "center",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "6px solid #35a852",
              color: "#35a852",
              fontSize: "54px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 18px",
            }}
          >
            ✓
          </div>

          <h1
            style={{
              fontSize: "34px",
              margin: "0 0 8px",
              fontWeight: 800,
            }}
          >
            ชำระเงินสำเร็จ
          </h1>

          <p
            style={{
              fontSize: "20px",
              margin: "0 0 20px",
            }}
          >
            ขอบคุณที่ใช้บริการ
          </p>

          {finalReviewUrl ? (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                background: "#fafafa",
                borderRadius: "18px",
                border: "1px solid #eee",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  margin: "0 0 14px",
                  fontWeight: 800,
                }}
              >
                สแกน QR เพื่อประเมิน
              </h2>

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(finalReviewUrl)}`}
                alt="QR Review"
                style={{
                  width: "220px",
                  height: "220px",
                  maxWidth: "80vw",
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "8px",
                }}
              />

              <button
                type="button"
                onClick={() => setPage("review")}
                style={{
                  display: "block",
                  margin: "14px auto 0",
                  background: "#35a852",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "12px 22px",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                เปิดแบบประเมิน
              </button>
            </div>
          ) : (
            <p
              style={{
                fontSize: "18px",
                color: "#777",
                margin: "18px 0",
              }}
            >
              ไม่มี QR สำหรับแบบประเมิน
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              if (clearTable) clearTable();
            }}
            style={{
              marginTop: "22px",
              background: "#2f80ed",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "14px 26px",
              fontSize: "18px",
              fontWeight: 800,
            }}
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  })()}

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
          <ReviewPage
            reviewData={reviewSessionData}
            onSubmit={submitReview}
          />
        </div>
      )}

      {page === "thank-you" && (
        <ThankYou customer={reviewCustomer} />
      )}
    </>
  );
}

export default App;
