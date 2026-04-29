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
  const [peopleCount, setPeopleCount] = useState(1);
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

  useEffect(() => {
    saveDB(db);
  }, [db]);

  const currentReservations = useMemo(() => {
    if (!customer) return [];

    return db.reservations.filter(
      (reservation) => reservation.customerId === customer.CId
    );
  }, [db.reservations, customer]);

  const cartTotal = calculateCartTotal(cart);
  const cartCount = getCartCount(cart);

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
    setPeopleCount(1);
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
  }

  function handleEmployeeLogin() {
    const foundEmployee = db.employees.find(
      (item) =>
        item.EId.toLowerCase() === employeeId.trim().toLowerCase() &&
        item.EStatus === "กำลังทำงาน"
    );

    if (!foundEmployee) {
      alert("ไม่พบข้อมูลพนักงาน");
      return;
    }

    setEmployee(foundEmployee);
    setPage("employee-confirm");
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

  function handleGeneralCustomer() {
    const generalCustomer = {
      CId: generateId("G"),
      type: "General",
      name: "ลูกค้าทั่วไป",
    };

    setCustomerType("General");
    setCustomer(generalCustomer);
    setSelectedTable(null);
    setPage("service-table");
  }

  function goToMemberLogin(mode) {
    setMemberMode(mode);
    setMemberTel("");
    setPage("member-login");
  }

  function handleFindMember() {
    if (!memberTel.trim()) {
      alert("กรุณากรอกเบอร์โทรสมาชิก");
      return;
    }

    const foundMember = db.members.find(
      (member) => member.MTel === memberTel.trim()
    );

    if (!foundMember) {
      alert("ไม่พบสมาชิก กรุณาสมัครสมาชิกก่อน");
      return;
    }

    setCustomerType("Member");
    setCustomer(foundMember);

    if (memberMode === "reserve") {
      setPage("reservation-page");
      return;
    }

    const memberReservations = db.reservations.filter(
      (reservation) =>
        reservation.customerId === foundMember.CId &&
        reservation.status === "reserved"
    );

    if (memberReservations.length > 0) {
      setPage("reservation-history");
      return;
    }

    setSelectedTable(null);
    setPage("service-table");
  }

  function handleRegisterSubmit() {
    const { firstName, lastName, tel, email } = registerForm;

    if (!firstName || !lastName || !tel || !email) {
      alert("กรุณากรอกข้อมูลสมัครสมาชิกให้ครบ");
      return;
    }

    const existingMember = db.members.find(
      (member) => member.MTel === tel.trim()
    );

    if (existingMember) {
      alert("เบอร์นี้สมัครสมาชิกแล้ว ระบบจะใช้ข้อมูลเดิม");
      setCustomerType("Member");
      setCustomer(existingMember);
      setPage("register-success");
      return;
    }

    const newMember = {
      CId: generateId("MB"),
      MFirstName: firstName.trim(),
      MSurName: lastName.trim(),
      MTel: tel.trim(),
      MEmail: email.trim(),
    };

    updateDB((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));

    setCustomerType("Member");
    setCustomer(newMember);
    setPage("register-success");
  }

  function goAfterRegisterSuccess() {
    if (memberMode === "reserve") {
      setPage("reservation-page");
      return;
    }

    setSelectedTable(null);
    setPage("service-table");
  }

  function handleSelectServiceTable(table) {
    setSelectedTable(table);

    if (table.Status === "ไม่ว่าง") {
      setPage("order-food");
      return;
    }

    updateDB((prev) => ({
      ...prev,
      tables: prev.tables.map((item) =>
        item.TNumber === table.TNumber
          ? {
              ...item,
              Status: "ไม่ว่าง",
              employeeId: employee?.EId || "",
            }
          : item
      ),
    }));

    setPage("order-food");
  }

  function handleCreateReservation({ table, date, time, count }) {
    if (!customer) {
      alert("กรุณาเลือกสมาชิกก่อนจองโต๊ะ");
      return;
    }

    if (!date || !time || !table) {
      alert("กรุณาเลือกวันที่ เวลา และโต๊ะ");
      return;
    }

    const newReservation = {
      RId: generateId("R"),
      customerId: customer.CId,
      tableNumber: table.TNumber,
      RDate: date,
      RTime: time,
      PeopleCount: count,
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
    setPeopleCount(1);
    setPage("reservation-success");
  }

  function handleCheckInReservation(reservation) {
    const table = db.tables.find(
      (item) => item.TNumber === reservation.tableNumber
    );

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

  function handleCancelReservation(reservation) {
    if (reservation.status === "checked_in") {
      alert("ไม่สามารถยกเลิกได้ เพราะ Check-in แล้ว");
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

  function addToCart(menu, options) {
    if (!menu) return;

    const finalPrice = calculateItemPrice(menu, options);

    const newItem = {
      cartId: generateId("CART"),
      menuId: menu.id,
      name: menu.name,
      image: menu.image,
      basePrice: menu.price,
      finalPrice,
      options,
      quantity: 1,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedMenu(null);
    setPage("order-food");
  }

  function increaseCartItem(cartId) {
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseCartItem(cartId) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeCartItem(cartId) {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }

  function confirmOrder() {
    if (cart.length === 0) {
      alert("ยังไม่มีรายการในตะกร้า");
      return;
    }

    if (!selectedTable) {
      alert("กรุณาเลือกโต๊ะก่อน");
      return;
    }

    const newOrder = {
      orderId: generateId("O"),
      tableNumber: selectedTable.TNumber,
      customerId: customer?.CId || "",
      customerType,
      employeeId: employee?.EId || "",
      items: cart,
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
              employeeId: employee?.EId || "",
            }
          : table
      ),
    }));

    setCart([]);
    setPage("order-success");
  }

  const showHeader =
    employee &&
    !["employee-login", "employee-confirm", "employee-success"].includes(page);

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
          onBillClick={() => alert("หน้าบิลเป็นงานคนที่ 3")}
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
          reservationDate={reservationDate}
          setReservationDate={setReservationDate}
          reservationTime={reservationTime}
          setReservationTime={setReservationTime}
          peopleCount={peopleCount}
          setPeopleCount={setPeopleCount}
          onCreateReservation={handleCreateReservation}
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
          onGoBill={() => alert("หน้าบิลเป็นงานคนที่ 3")}
        />
      )}
    </>
  );
}

export default App;
