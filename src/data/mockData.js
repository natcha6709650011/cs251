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
  // 1. หมวด "อาหาร"
  { id: "A001", name: "ข้าวผัดกะเพราหมูสับ", category: "food", price: 60, image: "https://www.thammculture.com/wp-content/uploads/2024/01/Untitled-612.jpg", recommended: true, optionType: "food" },
  { id: "A002", name: "ข้าวผัดกะเพราไก่", category: "food", price: 60, image: "https://s359.kapook.com/pagebuilder/7595f0f5-696a-4cfe-ad3a-9cd4dd3ccbf8.jpg", optionType: "food" },
  { id: "A003", name: "ข้าวผัดกะเพราหมึก", category: "food", price: 70, image: "https://i.ytimg.com/vi/Ggm8dHFxcTk/maxresdefault.jpg", optionType: "food" },
  { id: "A004", name: "ข้าวผัดกะเพรากุ้ง", category: "food", price: 75, image: "https://www.lemon8-app.com/seo/image?item_id=7209222474939040257&index=3&sign=e235c73e1f5186e86dc7f369aa5ec772", optionType: "food" },
  { id: "A005", name: "ข้าวผัดกะเพราทะเล", category: "food", price: 80, image: "https://s359.kapook.com/pagebuilder/77e69f79-d857-4153-9052-b8a20d7259d8.jpg", optionType: "food" },
  
  { id: "A006", name: "ข้าวผัดหมู", category: "food", price: 60, image: "https://www.naibann.com/wp-content/uploads/2015/09/k6.jpg", recommended: false, optionType: "food" },
  { id: "A007", name: "ข้าวผัดไก่", category: "food", price: 60, image: "https://s359.kapook.com/pagebuilder/1e3680c3-4869-4372-90d3-8e6847b91801.jpg", optionType: "food" },
  { id: "A008", name: "ข้าวผัดหมึก", category: "food", price: 70, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrgo-Kf8nccG_8lgg1qNzIiwBUgMRGns6tjg&s", optionType: "food" },
  { id: "A009", name: "ข้าวผัดกุ้ง", category: "food", price: 75, image: "https://img-global.cpcdn.com/recipes/725b05b137e5b4c3/1200x630cq80/photo.jpg", optionType: "food" },
  { id: "A010", name: "ข้าวผัดรวมมิตร", category: "food", price: 80, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", optionType: "food" },

  // 2. หมวด "ของทานเล่นและของหวาน"
  { id: "D001", name: "เฟรนช์ฟรายส์", category: "snack-dessert", price: 50, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400", optionType: "simple" },
  { id: "D002", name: "ไก่ป๊อป", category: "snack-dessert", price: 60, image: "https://cm.lnwfile.com/_/cm/_raw/92/nb/jq.jpg", optionType: "simple" },
  { id: "D003", name: "กุ้งชุบแป้งทอด", category: "snack-dessert", price: 70, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCwRneMkPLlyZ1F6NgmhugLrQLbah2nTRoEg&s", optionType: "simple" },
  { id: "D004", name: "เอ็นไก่ทอด", category: "snack-dessert", price: 65, image: "https://images.unsplash.com/photo-1623910390145-2f9864758d41?w=400", optionType: "simple" },
  { id: "D005", name: "นักเก็ต", category: "snack-dessert", price: 60, image: "https://images.unsplash.com/photo-1628172905146-2b47e2ef39d7?w=400", optionType: "simple" },

  { id: "D006", name: "บราวนี่", category: "snack-dessert", price: 55, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", optionType: "simple" },
  { id: "D007", name: "ไอศกรีมรสช็อกโกแลต", category: "snack-dessert", price: 40, image: "https://images.unsplash.com/photo-1579733075531-dfbf74533967?w=400", optionType: "simple" },
  { id: "D008", name: "ไอศกรีมรสมะนาว", category: "snack-dessert", price: 40, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", optionType: "simple" },
  { id: "D009", name: "ไอศกรีมรสสตอเบอรี่", category: "snack-dessert", price: 40, image: "https://images.unsplash.com/photo-1579733075531-dfbf74533967?w=400", optionType: "simple" },
  { id: "D010", name: "ไอศกรีมรสวนิลา", category: "snack-dessert", price: 40, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", optionType: "simple" },

  // 3. หมวด "เครื่องดื่ม"
  { id: "B001", name: "น้ำเปล่า", category: "drink", price: 15, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", optionType: "simple" },
  { id: "B002", name: "น้ำส้มคั้นสด", category: "drink", price: 40, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", optionType: "simple" },
  { id: "B003", name: "น้ำมะนาว", category: "drink", price: 40, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400", optionType: "simple" },
  { id: "B004", name: "เป๊ปซี่", category: "drink", price: 25, image: "https://images.unsplash.com/photo-1623910390145-2f9864758d41?w=400", optionType: "simple" },
  { id: "B005", name: "ชามะนาว", category: "drink", price: 45, image: "https://images.unsplash.com/photo-1628172905146-2b47e2ef39d7?w=400", optionType: "simple" },
  
  { id: "B006", name: "ชาไทย", category: "drink", price: 45, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400", optionType: "drink" },
  { id: "B007", name: "เอสเพรสโซ่", category: "drink", price: 50, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", optionType: "drink" },
  { id: "B008", name: "ลาเต้", category: "drink", price: 50, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", optionType: "drink" },
  { id: "B009", name: "อเมริกาโน่", category: "drink", price: 45, image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400", optionType: "drink" },
  { id: "B010", name: "โกโก้", category: "drink", price: 45, image: "https://images.unsplash.com/photo-1623910390145-2f9864758d41?w=400", optionType: "drink" },
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
