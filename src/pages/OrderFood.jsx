// src/pages/OrderFood.jsx
import "../styles/person2-order.css";
import { useMemo } from "react";
import { menus as menuData } from "../data/menuData";

export default function OrderFood({
  menus = [],
  activeCategory,
  setActiveCategory,
  onMenuClick,
}) {
  const displayMenus = useMemo(() => {
    const menuList = Array.isArray(menus) ? menus : [];

    const mergedMenus = menuList.map((menu) => {
      const originalMenu = menuData.find(
        (item) =>
          String(item.id) === String(menu.id) || item.name === menu.name
      );

      return {
        ...originalMenu,
        ...menu,
        image:
          menu.image && menu.image.trim() !== ""
            ? menu.image
            : originalMenu?.image || "",
        category: menu.category || originalMenu?.category,
        recommended: menu.recommended ?? originalMenu?.recommended,
      };
    });

    if (activeCategory === "recommended") {
      return mergedMenus.filter(
        (m) => m.category === "recommended" || m.recommended === true
      );
    }

    return mergedMenus.filter((m) => m.category === activeCategory);
  }, [menus, activeCategory]);

  return (
    <div className="p2-menu-page">
      <div className="p2-top-header">
        <div className="p2-header-content">
          <div className="p2-profile-section">
            <div className="p2-avatar">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
                alt="profile"
                referrerPolicy="no-referrer"
              />
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

      <div className="p2-category-tabs">
        <button
          className={activeCategory === "recommended" ? "p2-active" : ""}
          onClick={() => setActiveCategory("recommended")}
        >
          เมนูแนะนำ
        </button>

        <button
          className={activeCategory === "food" ? "p2-active" : ""}
          onClick={() => setActiveCategory("food")}
        >
          อาหาร
        </button>

        <button
          className={activeCategory === "snackDessert" ? "p2-active" : ""}
          onClick={() => setActiveCategory("snackDessert")}
        >
          ของทานเล่นและของหวาน
        </button>

        <button
          className={activeCategory === "drink" ? "p2-active" : ""}
          onClick={() => setActiveCategory("drink")}
        >
          เครื่องดื่ม
        </button>
      </div>

      <div className="p2-menu-grid">
        {displayMenus.map((menu) => (
          <div
            key={menu.id}
            className="p2-menu-card"
            onClick={() => onMenuClick(menu)}
          >
            <div className="p2-card-img">
              {menu.image ? (
                <img
                  src={menu.image}
                  alt={menu.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/180x180?text=Image";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f1f1f1",
                    color: "#777",
                  }}
                >
                  ใส่รูป
                </div>
              )}
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