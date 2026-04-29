// src/pages/OrderFood.jsx
import "../styles/person2-order.css";
import { useMemo } from "react";

export default function OrderFood({ menus, activeCategory, setActiveCategory, onMenuClick }) {
  
  // 1. กรองเมนูตาม Category ที่กดเลือก
  const displayMenus = useMemo(() => {
    if (activeCategory === "recommended") {
      return menus.filter((m) => m.recommended);
    }
    return menus.filter((m) => m.category === activeCategory);
  }, [menus, activeCategory]);

  return (
    <div className="p2-menu-page">
      {/* ส่วน Header สีแดง */}
      <div className="p2-top-header">
        <div className="p2-header-content">
          <div className="p2-profile-section">
            <div className="p2-avatar">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="profile" />
            </div>
            <button className="p2-btn-white">M5</button>
            <button className="p2-btn-white">เลือกโต๊ะ</button>
          </div>
          <div className="p2-cart-section">
             <span className="p2-cart-icon">🛒</span>
             <button className="p2-btn-white">ตะกร้าของคุณ</button>
             <button className="p2-btn-white">บิล</button>
          </div>
        </div>
      </div>

      {/* ส่วนปุ่มเลือกหมวดหมู่ (ที่หายไป) */}
      <div className="p2-category-tabs">
        <button 
          className={activeCategory === "recommended" ? "p2-active" : ""}
          onClick={() => setActiveCategory("recommended")}
        >เมนูแนะนำ</button>
        <button 
          className={activeCategory === "food" ? "p2-active" : ""}
          onClick={() => setActiveCategory("food")}
        >อาหาร</button>
        <button 
          className={activeCategory === "snack-dessert" ? "p2-active" : ""}
          onClick={() => setActiveCategory("snack-dessert")}
        >ของทานเล่นและของหวาน</button>
        <button 
          className={activeCategory === "drink" ? "p2-active" : ""}
          onClick={() => setActiveCategory("drink")}
        >เครื่องดื่ม</button>
      </div>

      {/* ส่วนแสดงรูปภาพเมนู */}
      <div className="p2-menu-grid">
        {displayMenus.map((menu) => (
          <div key={menu.id} className="p2-menu-card" onClick={() => onMenuClick(menu)}>
            <div className="p2-card-img">
              <img src={menu.image} alt={menu.name} onError={(e) => e.target.src='https://via.placeholder.com/150'} />
            </div>
            <div className="p2-card-detail">
              <h4>{menu.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}