import "../styles/person2-order.css";

function MenuDetail({
  selectedMenu,
  menuOptions,
  setMenuOptions,
  onAddToCart,
  onBack,
}) {
  if (!selectedMenu) return null;

  function updateOption(key, value) {
    setMenuOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // ฟังก์ชันจัดการ Checkbox สำหรับ Topping
  function handleToppingChange(toppingName) {
    const currentToppings = menuOptions.toppings || [];
    if (currentToppings.includes(toppingName)) {
      updateOption("toppings", currentToppings.filter(t => t !== toppingName));
    } else {
      updateOption("toppings", [...currentToppings, toppingName]);
    }
  }

  function handleAddToCart() {
    onAddToCart(selectedMenu, menuOptions);
  }

  return (
    <main className="p2-detail-container">
      <section className="p2-detail-card">
       <button type="button" className="p2-back-btn" onClick={onBack}>
  <span className="p2-arrow-icon">❮</span> {/* ใช้สัญลักษณ์หัวลูกศรที่หนากว่า */}
</button>

        <div className="p2-detail-main-content">
          {/* ฝั่งซ้าย: รูปและชื่อเมนู */}
          <div className="p2-detail-left-side">
            <div className="p2-detail-img-wrapper">
              <img src={selectedMenu.image} alt={selectedMenu.name} className="p2-detail-img" />
            </div>
            <h2 className="p2-detail-menu-name">{selectedMenu.name}</h2>
          </div>

          {/* ฝั่งขวา: รายการตัวเลือก */}
          <div className="p2-detail-right-side">
            <div className="p2-options-scroll-area">
              
              {/* --- ส่วนของอาหาร (Food) --- */}
              {(selectedMenu.optionType === "food") && (
                <>
                  <div className="p2-option-section">
                    <h4 className="p2-option-header">ปริมาณ</h4>
                    <div className="p2-radio-group">
                      {["ธรรมดา", "พิเศษ"].map((size) => (
                        <label className="p2-option-label" key={size}>
                          <input type="radio" name="size" checked={menuOptions.size === size} onChange={() => updateOption("size", size)} />
                          <span className="p2-label-text">{size} {size === "พิเศษ" ? "(+ 10 บาท)" : ""}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p2-option-section">
                    <h4 className="p2-option-header">ท็อปปิ้ง</h4>
                    <div className="p2-checkbox-group">
                      {["ไข่ดาว (+10.-)", "ไข่เจียว (+10.-)", "ไข่ข้น (+15.-)"].map((topping) => (
                        <label className="p2-option-label" key={topping}>
                          <input type="checkbox" checked={(menuOptions.toppings || []).includes(topping)} onChange={() => handleToppingChange(topping)} />
                          <span className="p2-label-text">{topping}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* --- ส่วนของของทอด (Snack) --- */}
{selectedMenu.optionType === "snack" && (
  <>
    <div className="p2-option-section">
      <h4 className="p2-option-header">ปริมาณ</h4>
      <div className="p2-radio-group">
        {["ธรรมดา", "พิเศษ"].map((size) => (
          <label className="p2-option-label" key={size}>
            <input
              type="radio"
              name="size"
              checked={menuOptions.size === size}
              onChange={() => updateOption("size", size)}
            />
            <span className="p2-label-text">
              {size} {size === "พิเศษ" ? "(+10 บาท)" : ""}
            </span>
          </label>
        ))}
      </div>
    </div>

    <div className="p2-option-section">
      <h4 className="p2-option-header">ท็อปปิ้ง</h4>
      <div className="p2-checkbox-group">
        {["ชีสดิป (+10.-)"].map((topping) => (
          <label className="p2-option-label" key={topping}>
            <input
              type="checkbox"
              checked={(menuOptions.toppings || []).includes(topping)}
              onChange={() => handleToppingChange(topping)}
            />
            <span className="p2-label-text">{topping}</span>
          </label>
        ))}
      </div>
    </div>
  </>
)}

              {/* --- ส่วนของเครื่องดื่ม (Drink) --- */}
              {selectedMenu.optionType === "drink" && (
                <>
                  <div className="p2-option-section">
                    <h4 className="p2-option-header">ระดับความหวาน</h4>
                    <div className="p2-radio-group">
                      {["100%", "50%", "25%", "0%"].map((sweet) => (
                        <label className="p2-option-label" key={sweet}>
                          <input type="radio" name="sweetness" checked={menuOptions.sweetness === sweet} onChange={() => updateOption("sweetness", sweet)} />
                          <span className="p2-label-text">หวาน {sweet}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p2-option-section">
                    <h4 className="p2-option-header">รูปแบบ</h4>
                    <div className="p2-radio-group">
                      {["เย็น", "ปั่น (+5.-)"].map((type) => (
                        <label className="p2-option-label" key={type}>
                          <input type="radio" name="drinkType" checked={menuOptions.drinkType === type} onChange={() => updateOption("drinkType", type)} />
                          <span className="p2-label-text">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* --- ส่วนเพิ่มเติม (มีทุกเมนู) --- */}
              <div className="p2-option-section">
                <h4 className="p2-option-header">เพิ่มเติม</h4>
                <input
                  type="text"
                  className="p2-note-input"
                  placeholder="ระบุรายละเอียดเพิ่มเติม"
                  value={menuOptions.note || ""}
                  onChange={(e) => updateOption("note", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p2-detail-footer">
          <button type="button" className="p2-add-to-cart-btn" onClick={handleAddToCart}>
            ยืนยัน
          </button>
        </div>
      </section>
    </main>
  );
}

export default MenuDetail;