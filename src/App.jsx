import Header from "./components/Header";
import ReservationSuccess from "./pages/ReservationSuccess";

function App() {
  const employee = {
    EId: "M123456",
    EFirstName: "ขยัน",
    ESurName: "รักดี",
    ERole: "พนักงานเสิร์ฟ",
    EStatus: "กำลังทำงาน",
    avatar: "",
  };

  const customer = {
    CId: "MB0002",
    MFirstName: "ณิชชา",
    MSurName: "กาญจนภากา",
    MTel: "0812345678",
    MEmail: "member@email.com",
  };

  const reservation = {
    RId: "R001",
    customerId: "MB0002",
    tableNumber: "M5",
    RDate: "2026-04-29",
    RTime: "09:51",
    PeopleCount: 3,
    status: "reserved",
  };

  return (
    <>
      <Header
        employee={employee}
        selectedTable={null}
        cartCount={0}
        onEmployeeClick={() => alert("ข้อมูลพนักงาน")}
        onSelectTable={() => alert("เลือกโต๊ะ")}
        onCartClick={() => alert("ตะกร้า")}
        onBillClick={() => alert("บิล")}
      />

      <ReservationSuccess
        customer={customer}
        reservation={reservation}
        onHome={() => alert("กลับหน้าเลือกประเภทลูกค้า")}
        onHistory={() => alert("ไปหน้าประวัติการจอง")}
      />
    </>
  );
}

export default App;