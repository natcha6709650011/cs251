import "../styles/person2-order.css";

export default function MenuDetail({ selectedMenu, menuOptions, setMenuOptions, onAddToCart, onBack }) {
  if (!selectedMenu) return null;

  // ฟังก์ชันอัปเดต Option ทีละอย่าง
  const updateOption = (key, value) => {
    setMenuOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p2-detail-container">
      <div className="p2-detail-card">
        <button className="p2-back-btn" onClick={onBack}>✕</button>
        
        <img src={selectedMenu.image} alt={selectedMenu.name} className="p2-detail-img" />
        
        <div className="p2-detail-content">
          <h2 className="p2-detail-title">{selectedMenu.name}</h2>
          <p className="p2-detail-price">ราคาเริ่มต้น {selectedMenu.price} บาท</p>

          <div className="p2-options-scroll">
            {/* --- ส่วนของอาหาร (Food / Snack) --- */}
            {(selectedMenu.optionType === "food" || selectedMenu.optionType === "snack") && (
              <div className="p2-option-group">
                <h4>ปริมาณ</h4>
                <div className="p2-btn-group">
                  {["ธรรมดา", "พิเศษ"].map((s) => (
                    <button 
                      key={s} 
                      className={menuOptions.size === s ? "p2-opt-btn active" : "p2-opt-btn"}
                      onClick={() => updateOption("size", s)}
                    >
                      {s} {s === "พิเศษ" ? "(+10)" : ""}
                    </button>
                  ))}
                </div>

                <h4>ท็อปปิ้ง</h4>
                <div className="p2-btn-group">
                  {selectedMenu.optionType === "food" ? (
                    ["ไม่ใส่", "ไข่ดาว", "ไข่เจียว", "ไข่ข้น"].map((t) => (
                      <button 
                        key={t} 
                        className={menuOptions.topping === t ? "p2-opt-btn active" : "p2-opt-btn"}
                        onClick={() => updateOption("topping", t)}
                      >
                        {t} {t.includes("ไข่") ? (t === "ไข่ข้น" ? "+15" : "+10") : ""}
                      </button>
                    ))
                  ) : (
                    <button 
                      className={menuOptions.topping === "ชีสดิป" ? "p2-opt-btn active" : "p2-opt-btn"}
                      onClick={() => updateOption("topping", menuOptions.topping === "ชีสดิป" ? "" : "ชีสดิป")}
                    >
                      ชีสดิป (+10)
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* --- ส่วนของเครื่องดื่ม (Drink) --- */}
            {selectedMenu.optionType === "drink" && (
              <div className="p2-option-group">
                <h4>ประเภท</h4>
                <div className="p2-btn-group">
                  {["ร้อน", "เย็น (+5)", "ปั่น (+10)"].map((d) => (
                    <button 
                      key={d} 
                      className={menuOptions.drinkType === d ? "p2-opt-btn active" : "p2-opt-btn"}
                      onClick={() => updateOption("drinkType", d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <h4>ความหวาน</h4>
                <div className="p2-btn-group">
                  {["120%", "100%", "50%", "25%", "0%"].map((sw) => (
                    <button 
                      key={sw} 
                      className={menuOptions.sweetness === sw ? "p2-opt-btn active" : "p2-opt-btn"}
                      onClick={() => updateOption("sweetness", sw)}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p2-option-group">
              <h4>หมายเหตุ</h4>
              <input 
                type="text" 
                className="p2-note-input"
                placeholder="ระบุรายละเอียดเพิ่มเติม..."
                value={menuOptions.note}
                onChange={(e) => updateOption("note", e.target.value)}
              />
            </div>
          </div>

          <button className="p2-add-to-cart-btn" onClick={onAddToCart}>
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}