import { useState } from "react";
// 1. Import เฉพาะ 3 ไฟล์งานหลักของคุณ (ตัด Cart ออก)
import OrderFood from "./pages/OrderFood";
import MenuDetail from "./pages/MenuDetail";
import OrderSuccess from "./pages/OrderSuccess";

// 2. Import ข้อมูล Mock Data และ ฟังก์ชันคำนวณราคา
import { initialDB } from "./data/mockData";
import { calculateItemPrice } from "./utils/price";
import { generateId } from "./utils/helpers";

function App() {
  // --- States ---
  const [page, setPage] = useState("order-food"); // เริ่มที่หน้าเลือกอาหารเลย
  const [activeCategory, setActiveCategory] = useState("recommended");
  const [selectedMenu, setSelectedMenu] = useState(null);
  // State เก็บค่า Options ที่ผู้เลือก (ไข่ดาว, หวานน้อย ฯลฯ)
  const [menuOptions, setMenuOptions] = useState({ size: "ธรรมดา", topping: "", drinkType: "", sweetness: "", note: "" });
  
  // State จำลองตะกร้าสินค้า (ยังต้องมีไว้เก็บข้อมูล แต่เราจะไม่แสดงหน้า Cart)
  const [cart, setCart] = useState([]);

  // --- Functions ---

  // ฟังก์ชันเมื่อคลิกที่เมนู
  const handleMenuClick = (menu) => {
    if (menu.optionType === "simple") {
      addToCart(menu, {}); // ถ้าไม่มีตัวเลือกเสริม ให้ลงตะกร้าจำลองทันที
      return;
    }
    setSelectedMenu(menu); // เก็บเมนูที่เลือกเพื่อเอาไปแสดงหน้า Detail
    setMenuOptions({ size: "ธรรมดา", topping: "", drinkType: "", sweetness: "", note: "" }); // รีเซ็ต Options
    setPage("menu-detail"); // ไปหน้าเลือก Option
  };

  // ฟังก์ชันเพิ่มลงตะกร้าจำลอง
  const addToCart = (menu, options) => {
    const finalPrice = calculateItemPrice(menu, options);
    const newItem = {
      cartId: generateId("CART"),
      menuId: menu.id,
      name: menu.name,
      basePrice: menu.price,
      finalPrice,
      options,
      quantity: 1
    };
    setCart((prev) => [...prev, newItem]); // เพิ่มเข้า State ตะกร้า
    setSelectedMenu(null);
    setPage("order-food"); // กลับมาหน้าเลือกอาหาร
    console.log("ตะกร้าปัจจุบัน:", cart); // ปริ้นดูใน Console ว่าข้อมูลมาไหม
  };

  return (
    <div className="app-container">


      {/* Render หน้าตาม State page */}
      {page === "order-food" && (
        <OrderFood 
          menus={initialDB.menus} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
          onMenuClick={handleMenuClick} 
        />
      )}

      {page === "menu-detail" && (
        <MenuDetail 
          selectedMenu={selectedMenu} 
          menuOptions={menuOptions} 
          setMenuOptions={setMenuOptions} 
          onAddToCart={() => addToCart(selectedMenu, menuOptions)} // เมื่อกดเพิ่ม -> ลงตะกร้าจำลอง -> กลับหน้าอาหาร
          onBack={() => setPage("order-food")} 
        />
      )}

      {/* หน้า Cart ถูกตัดออกไป */}
      {/* {page === "cart" && ( <Cart ... /> )} */}

      {page === "order-success" && (
        <OrderSuccess 
          onBackToMenu={() => setPage("order-food")} 
          onBill={() => alert("ไปหน้า Bill (งานส่วนของคนอื่น)")} 
        />
      )}
    </div>
  );
}

export default App;