import { useState } from "react";
import Header from "./components/Header";
import MemberRegister from "./pages/MemberRegister";

function App() {
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
  });

  const employee = {
    EId: "M123456",
    EFirstName: "ขยัน",
    ESurName: "รักดี",
    ERole: "พนักงานเสิร์ฟ",
    EStatus: "กำลังทำงาน",
    avatar: "",
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

      <MemberRegister
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        onSubmit={() => alert(JSON.stringify(registerForm, null, 2))}
        onBack={() => alert("กลับหน้ากรอกเบอร์สมาชิก")}
      />
    </>
  );
}

export default App;