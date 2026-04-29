import Header from "./components/Header";
import RegisterSuccess from "./pages/RegisterSuccess";

function App() {
  const employee = {
    EId: "E123456",
    EFirstName: "ขยัน",
    ESurName: "รักดี",
    ERole: "พนักงานเสิร์ฟ",
    EStatus: "กำลังทำงาน",
    avatar: "",
  };

  const customer = {
    CId: "M0002",
    MFirstName: "ณัชชา",
    MSurName: "กาญจนาภา",
    MTel: "0812345678",
    MEmail: "member@email.com",
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

      <RegisterSuccess
        customer={customer}
        memberMode="order"
        onNext={() => alert("ไปหน้าเลือกโต๊ะ")}
      />
    </>
  );
}

export default App;