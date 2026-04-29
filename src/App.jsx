import { useState } from "react";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeConfirm from "./pages/EmployeeConfirm";
import EmployeeSuccess from "./pages/EmployeeSuccess";

function App() {
  const [page, setPage] = useState("login");
  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);

  const mockEmployee = {
    EId: "M123456",
    EFirstName: "ขยัน",
    ESurName: "รักดี",
    ERole: "พนักงานเสิร์ฟ",
    EStatus: "กำลังทำงาน",
    avatar: "",
  };

  function handleLogin() {
    if (employeeId.trim() !== "M123456") {
      alert("ไม่พบข้อมูลพนักงาน");
      return;
    }

    setEmployee(mockEmployee);
    setPage("confirm");
  }

  function handleLogout() {
    setEmployeeId("");
    setEmployee(null);
    setPage("login");
  }

  return (
    <>
      {page === "login" && (
        <EmployeeLogin
          employeeId={employeeId}
          setEmployeeId={setEmployeeId}
          onLogin={handleLogin}
        />
      )}

      {page === "confirm" && (
        <EmployeeConfirm
          employee={employee}
          onConfirm={() => setPage("success")}
          onLogout={handleLogout}
        />
      )}

      {page === "success" && (
        <EmployeeSuccess
          employee={employee}
          onNext={() => alert("ไปหน้าเลือกประเภทลูกค้า")}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;