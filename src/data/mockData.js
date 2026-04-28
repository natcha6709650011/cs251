export const initialEmployees = [
  {
    EId: "M123456",
    EFirstName: "ขยัน",
    ESurName: "รักดี",
    ERole: "พนักงานเสิร์ฟ",
    EStatus: "กำลังทำงาน",
    avatar: "",
  },
  {
    EId: "M654321",
    EFirstName: "มานะ",
    ESurName: "อดทน",
    ERole: "พนักงานบริการ",
    EStatus: "กำลังทำงาน",
    avatar: "",
  },
];

export const initialMembers = [
  {
    CId: "MB0001",
    MFirstName: "ณิชชา",
    MSurName: "กาญจนภากา",
    MTel: "0812345678",
    MEmail: "member@email.com",
  },
];

export const initialTables = [
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
  { TNumber: "L3", T_Type: "L", Status: "ไม่ว่าง", employeeId: "M654321" },
  { TNumber: "L4", T_Type: "L", Status: "ไม่ว่าง", employeeId: "M654321" },
  { TNumber: "L5", T_Type: "L", Status: "ไม่ว่าง", employeeId: "M654321" },
];

export const initialMenus = [
  { id: "F001", name: "ข้าวผัดกะเพราหมูสับ", category: "food", price: 50, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400", recommended: true, optionType: "food" },
  { id: "F002", name: "ข้าวผัดกะเพราไก่", category: "food", price: 50, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400", recommended: false, optionType: "food" },
  { id: "F003", name: "ข้าวผัด", category: "food", price: 55, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", recommended: true, optionType: "food" },
  { id: "S001", name: "เฟรนช์ฟรายส์", category: "snack-dessert", price: 45, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400", recommended: true, optionType: "snack" },
  { id: "D001", name: "บราวนี่", category: "snack-dessert", price: 45, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", recommended: true, optionType: "simple" },
  { id: "B001", name: "น้ำเปล่า", category: "drink", price: 15, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", recommended: false, optionType: "simple" },
  { id: "B003", name: "ชาไทย", category: "drink", price: 45, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400", recommended: true, optionType: "drink" },
];

export const experienceTopics = ["ความสะอาด", "ความรวดเร็ว", "รสชาติ", "ราคา"];

export const initialDB = {
  employees: initialEmployees,
  members: initialMembers,
  tables: initialTables,
  menus: initialMenus,
  reservations: [],
  orders: [],
  payments: [],
  reviewSessions: [],
  reviews: [],
  experienceTopics,
};
