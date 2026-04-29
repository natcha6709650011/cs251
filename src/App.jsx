import { useState } from "react";

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

const mockEmployee = {
  EId: "M123456",
  EFirstName: "ขยัน",
  ESurName: "รักดี",
  ERole: "พนักงานเสิร์ฟ",
  EStatus: "กำลังทำงาน",
  avatar: "",
};

const mockMembers = [
  {
    CId: "MB0001",
    MFirstName: "ณิชชา",
    MSurName: "กาญจนภากา",
    MTel: "0812345678",
    MEmail: "member@email.com",
  },
];

const initialTables = [
  { TNumber: "S1", T_Type: "S", Status: "ว่าง", employeeId: "" },
  { TNumber: "S2", T_Type: "S", Status: "ว่าง", employeeId: "" },
  { TNumber: "S3", T_Type: "S", Status: "ว่าง", employeeId: "" },
  { TNumber: "S4", T_Type: "S", Status: "ไม่ว่าง", employeeId: "M123456" },
  { TNumber: "S5", T_Type: "S", Status: "ไม่ว่าง", employeeId: "M123456" },

  { TNumber: "M1", T_Type: "M", Status: "ว่าง", employeeId: "" },
  { TNumber: "M2", T_Type: "M", Status: "ว่าง", employeeId: "" },
  { TNumber: "M3", T_Type: "M", Status: "ว่าง", employeeId: "" },
  { TNumber: "M4", T_Type: "M", Status: "ว่าง", employeeId: "" },
  { TNumber: "M5", T_Type: "M", Status: "ว่าง", employeeId: "" },

  { TNumber: "L1", T_Type: "L", Status: "ว่าง", employeeId: "" },
  { TNumber: "L2", T_Type: "L", Status: "ว่าง", employeeId: "" },
  { TNumber: "L3", T_Type: "L", Status: "ไม่ว่าง", employeeId: "M123456" },
  { TNumber: "L4", T_Type: "L", Status: "ไม่ว่าง", employeeId: "M123456" },
  { TNumber: "L5", T_Type: "L", Status: "ไม่ว่าง", employeeId: "M123456" },
];

function App() {
  const [page, setPage] = useState("employee-login");

  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(null);

  const [customerType, setCustomerType] = useState("");
  const [customer, setCustomer] = useState(null);

  const [members, setMembers] = useState(mockMembers);
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

  const [reservations, setReservations] = useState([
    {
      RId: "R001",
      customerId: "MB0001",
      tableNumber: "M5",
      RDate: new Date().toISOString().slice(0, 10),
      RTime: "09:51",
      PeopleCount: 3,
      status: "reserved",
    },
  ]);

  function makeId(prefix) {
    return `${prefix}${Date.now()}`;
  }

  function isToday(dateString) {
    return dateString === new Date().toISOString().slice(0, 10);
  }

  function handleEmployeeLogin() {
    if (employeeId.trim().toLowerCase() !== "m123456") {
      alert("ไม่พบข้อมูลพนักงาน");
      return;
    }

    setEmployee(mockEmployee);
    setPage("employee-confirm");
  }

  function logoutEmployee() {
    setEmployeeId("");
    setEmployee(null);
    setShowEmployeeModal(false);
    setSelectedTable(null);
    setCustomerType("");
    setCustomer(null);
    setMemberTel("");
    setMemberMode("order");
    setRegisterForm({
      firstName: "",
      lastName: "",
      tel: "",
      email: "",
    });
    setReservationDate("");
    setReservationTime("");
    setPeopleCount(1);
    setSelectedReservation(null);
    setPage("employee-login");
  }

  function goCustomerType() {
    setSelectedTable(null);
    setCustomerType("");
    setCustomer(null);
    setMemberTel("");
    setMemberMode("order");
    setPage("customer-type");
  }

  function handleGeneralCustomer() {
    const generalCustomer = {
      CId: makeId("G"),
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

    const foundMember = members.find(
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

    const memberReservations = reservations.filter(
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

    const existingMember = members.find((member) => member.MTel === tel.trim());

    if (existingMember) {
      alert("เบอร์นี้สมัครสมาชิกแล้ว ระบบจะใช้ข้อมูลเดิม");
      setCustomerType("Member");
      setCustomer(existingMember);
      setPage("register-success");
      return;
    }

    const newMember = {
      CId: makeId("MB"),
      MFirstName: firstName.trim(),
      MSurName: lastName.trim(),
      MTel: tel.trim(),
      MEmail: email.trim(),
    };

    setMembers((prev) => [...prev, newMember]);
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

    if (table.Status === "ว่าง") {
      setTables((prev) =>
        prev.map((item) =>
          item.TNumber === table.TNumber
            ? {
                ...item,
                Status: "ไม่ว่าง",
                employeeId: employee?.EId || "",
              }
            : item
        )
      );
    }

    setPage("order-food-placeholder");
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
      RId: makeId("R"),
      customerId: customer.CId,
      tableNumber: table.TNumber,
      RDate: date,
      RTime: time,
      PeopleCount: count,
      status: "reserved",
    };

    setReservations((prev) => [...prev, newReservation]);
    setSelectedReservation(newReservation);
    setReservationDate("");
    setReservationTime("");
    setPeopleCount(1);
    setPage("reservation-success");
  }

  function handleCheckInReservation(reservation) {
    const table = tables.find((item) => item.TNumber === reservation.tableNumber);

    setReservations((prev) =>
      prev.map((item) =>
        item.RId === reservation.RId
          ? {
              ...item,
              status: "checked_in",
            }
          : item
      )
    );

    setTables((prev) =>
      prev.map((item) =>
        item.TNumber === reservation.tableNumber
          ? {
              ...item,
              Status: "ไม่ว่าง",
              employeeId: employee?.EId || "",
            }
          : item
      )
    );

    setSelectedReservation({
      ...reservation,
      status: "checked_in",
    });

    setSelectedTable(table || { TNumber: reservation.tableNumber });
    setPage("order-food-placeholder");
  }

  function handleCancelReservation(reservation) {
    if (reservation.status === "checked_in") {
      alert("ไม่สามารถยกเลิกได้ เพราะ Check-in แล้ว");
      return;
    }

    setReservations((prev) =>
      prev.map((item) =>
        item.RId === reservation.RId
          ? {
              ...item,
              status: "cancelled",
            }
          : item
      )
    );
  }

  const currentReservations = customer
    ? reservations.filter((reservation) => reservation.customerId === customer.CId)
    : [];

  const showHeader =
    employee &&
    !["employee-login", "employee-confirm", "employee-success"].includes(page);

  return (
    <>
      {showHeader && (
        <Header
          employee={employee}
          selectedTable={selectedTable}
          cartCount={0}
          onEmployeeClick={() => setShowEmployeeModal(true)}
          onSelectTable={() => setPage("service-table")}
          onCartClick={() => alert("หน้าตะกร้าเป็นงานคนที่ 2")}
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
          employee={employee}
          onGeneral={handleGeneralCustomer}
          onMember={() => goToMemberLogin("order")}
          onReserve={() => goToMemberLogin("reserve")}
        />
      )}

      {page === "service-table" && (
        <ServiceTable tables={tables} onTableClick={handleSelectServiceTable} />
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
          tables={tables}
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

      {page === "order-food-placeholder" && (
        <main className="p1-page">
          <section className="p1-history-empty" style={{ width: "520px", margin: "100px auto" }}>
            <h1>หน้าสั่งอาหาร</h1>
            <p>Mock: งานคนที่ 2 จะมาต่อจากหน้านี้</p>

            <button
              type="button"
              className="app-btn app-btn-blue"
              onClick={() => setPage("customer-type")}
            >
              กลับหน้าเลือกประเภทลูกค้า
            </button>
          </section>
        </main>
      )}
    </>
  );
}

export default App;
