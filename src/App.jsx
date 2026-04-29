import { useState } from "react";
import Header from "./components/Header";
import EmployeeModal from "./components/EmployeeModal";
import ServiceTable from "./pages/ServiceTable";

function App() {
  const [showModal, setShowModal] = useState(false);

  const employee = {
    EId: "M123456",
    EFirstName: "ขยัน",
    ESurName: "รักดี",
    ERole: "พนักงานเสิร์ฟ",
    EStatus: "กำลังทำงาน",
    avatar: "",
  };

  const tables = [
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

  return (
    <>
      <Header
        employee={employee}
        selectedTable={{ TNumber: "M5" }}
        cartCount={3}
        onEmployeeClick={() => setShowModal(true)}
        onSelectTable={() => alert("เลือกโต๊ะ")}
        onCartClick={() => alert("ตะกร้า")}
        onBillClick={() => alert("บิล")}
      />

      {showModal && (
        <EmployeeModal
          employee={employee}
          onClose={() => setShowModal(false)}
          onLogout={() => alert("ออกจากระบบ")}
        />
      )}

      <ServiceTable
        tables={tables}
        onTableClick={(table) => alert(`เลือกโต๊ะ ${table.TNumber}`)}
      />
    </>
  );
}

export default App;