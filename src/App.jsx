import { useState } from "react";
import Header from "./components/Header";
import ReservationPage from "./pages/ReservationPage";

function App() {
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);

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
        selectedTable={null}
        cartCount={0}
        onEmployeeClick={() => alert("ข้อมูลพนักงาน")}
        onSelectTable={() => alert("เลือกโต๊ะ")}
        onCartClick={() => alert("ตะกร้า")}
        onBillClick={() => alert("บิล")}
      />

      <ReservationPage
        customer={customer}
        tables={tables}
        reservationDate={reservationDate}
        setReservationDate={setReservationDate}
        reservationTime={reservationTime}
        setReservationTime={setReservationTime}
        peopleCount={peopleCount}
        setPeopleCount={setPeopleCount}
        onCreateReservation={(data) =>
          alert(
            `จองโต๊ะ ${data.table.TNumber}\nวันที่ ${data.date}\nเวลา ${data.time}\nจำนวน ${data.count} คน`
          )
        }
      />
    </>
  );
}

export default App;