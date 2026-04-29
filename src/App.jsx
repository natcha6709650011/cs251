import { useState } from "react";
import Header from "./components/Header";
import MemberLogin from "./pages/MemberLogin";

function App() {
  const [memberTel, setMemberTel] = useState("");

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

      <MemberLogin
        memberTel={memberTel}
        setMemberTel={setMemberTel}
        memberMode="order"
        onSubmit={() => alert(`ค้นหาเบอร์ ${memberTel}`)}
        onRegister={() => alert("ไปหน้าสมัครสมาชิก")}
      />
    </>
  );
}

export default App;