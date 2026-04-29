import { menus } from "./menuData";

export const mockData = {
  employees: [
    {
      EId: "M123456",
      EFirstName: "ขยัน",
      ESurName: "รักดี",
      ERole: "พนักงานเสิร์ฟ",
      EStatus: "กำลังทำงาน",
      avatar: "",
    },
  ],

  members: [
    {
      CId: "MB0001",
      MFirstName: "ณิชชา",
      MSurName: "กาญจนภากา",
      MTel: "0812345678",
      MEmail: "member@email.com",
    },
  ],

  tables: [
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
  ],

  menus,

  reservations: [],
  orders: [],
  payments: [],
  reviewSessions: [],
  reviews: [],
  experienceTopics: [
    { id: "cleanliness", label: "ความสะอาด" },
    { id: "speed", label: "ความรวดเร็ว" },
    { id: "taste", label: "รสชาติ" },
    { id: "price", label: "ราคา" },
  ],
};