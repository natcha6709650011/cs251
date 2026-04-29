import "../styles/person2-order.css";

const tabs = [
  { key: "recommended", label: "เมนูแนะนำ" },
  { key: "food", label: "อาหาร" },
  { key: "snackDessert", label: "ของทานเล่นและของหวาน" },
  { key: "drink", label: "เครื่องดื่ม" },
];

function OrderFood({
  menus = [],
  activeCategory = "recommended",
  setActiveCategory,
  onMenuClick,
}) {
  const allMenus = Array.isArray(menus) ? menus : Object.values(menus).flat();

  const displayMenus = allMenus.filter((menu) => {
    if (activeCategory === "recommended") {
      return menu.category === "recommended" || menu.recommended === true;
    }

    return menu.category === activeCategory;
  });

  return (
    <main className="p2-order-page">
      <section className="p2-category-wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeCategory === tab.key
                ? "p2-category-btn p2-category-active"
                : "p2-category-btn"
            }
            onClick={() => setActiveCategory(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="p2-menu-grid">
        {displayMenus.length === 0 && (
          <div className="p2-empty-menu">
            ไม่พบเมนูในหมวดนี้ กรุณาเช็ก category ใน mockData.js
          </div>
        )}

        {displayMenus.map((menu) => (
          <button
            key={menu.id}
            type="button"
            className="p2-menu-card"
            onClick={() => onMenuClick(menu)}
          >
            <div className="p2-menu-image-box">
              {menu.image ? (
                <img
                  className="p2-menu-image"
                  src={menu.image}
                  alt={menu.name}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="p2-menu-image-placeholder">ใส่รูป</div>
              )}
            </div>

            <p className="p2-menu-name">{menu.name}</p>
          </button>
        ))}
      </section>
    </main>
  );
}

export default OrderFood;