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

  function handleAddToCart() {
    onAddToCart(selectedMenu, menuOptions);
  }

  return (
    <main className="p2-detail-container">
      <section className="p2-detail-card">
        <button type="button" className="p2-back-btn" onClick={onBack}>
          ←
        </button>

        <div className="p2-detail-left">
          <img
            src={selectedMenu.image}
            alt={selectedMenu.name}
            className="p2-detail-img"
          />

          <h2 className="p2-detail-menu-name">{selectedMenu.name}</h2>
        </div>

        <div className="p2-detail-content">
          <p className="p2-detail-price">ราคาเริ่มต้น {selectedMenu.price} บาท</p>

          <div className="p2-options-scroll">
            {(selectedMenu.optionType === "food" ||
              selectedMenu.optionType === "snack") && (
              <div className="p2-option-group">
                <h4>ปริมาณ</h4>

                <div className="p2-radio-row">
                  <label className="p2-radio-label">
                    <input
                      type="radio"
                      name="size"
                      checked={menuOptions.size === "ธรรมดา"}
                      onChange={() => updateOption("size", "ธรรมดา")}
                    />
                    ธรรมดา
                  </label>

                  <label className="p2-radio-label">
                    <input
                      type="radio"
                      name="size"
                      checked={menuOptions.size === "พิเศษ"}
                      onChange={() => updateOption("size", "พิเศษ")}
                    />
                    พิเศษ + 10 บาท
                  </label>
                </div>

                <h4>ท็อปปิ้ง</h4>

                {selectedMenu.optionType === "food" ? (
                  <div className="p2-radio-column">
                    {[
                      { label: "ไข่ดาว + 10 บาท", value: "ไข่ดาว" },
                      { label: "ไข่เจียว + 10 บาท", value: "ไข่เจียว" },
                      { label: "ไข่ข้น + 15 บาท", value: "ไข่ข้น" },
                    ].map((item) => (
                      <label className="p2-radio-label" key={item.value}>
                        <input
                          type="radio"
                          name="topping"
                          checked={menuOptions.topping === item.value}
                          onChange={() => updateOption("topping", item.value)}
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p2-radio-column">
                    <label className="p2-radio-label">
                      <input
                        type="radio"
                        name="topping"
                        checked={menuOptions.topping === "ชีสดิป"}
                        onChange={() => updateOption("topping", "ชีสดิป")}
                      />
                      ชีสดิป + 10 บาท
                    </label>
                  </div>
                )}
              </div>
            )}

            {selectedMenu.optionType === "drink" && (
              <div className="p2-option-group">
                <h4>ประเภท</h4>

                <div className="p2-radio-row">
                  {[
                    { label: "ร้อน", value: "ร้อน" },
                    { label: "เย็น + 5 บาท", value: "เย็น" },
                    { label: "ปั่น + 10 บาท", value: "ปั่น" },
                  ].map((item) => (
                    <label className="p2-radio-label" key={item.value}>
                      <input
                        type="radio"
                        name="drinkType"
                        checked={menuOptions.drinkType === item.value}
                        onChange={() => updateOption("drinkType", item.value)}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>

                <h4>ระดับความหวาน</h4>

                <div className="p2-radio-column">
                  {["120%", "100%", "50%", "25%", "0%"].map((sweetness) => (
                    <label className="p2-radio-label" key={sweetness}>
                      <input
                        type="radio"
                        name="sweetness"
                        checked={menuOptions.sweetness === sweetness}
                        onChange={() => updateOption("sweetness", sweetness)}
                      />
                      หวาน {sweetness}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="p2-option-group">
              <h4>เพิ่มเติม</h4>

              <input
                type="text"
                className="p2-note-input"
                placeholder="ระบุรายละเอียดเพิ่มเติม"
                value={menuOptions.note}
                onChange={(event) => updateOption("note", event.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="p2-add-to-cart-btn"
            onClick={handleAddToCart}
          >
            ยืนยัน
          </button>
        </div>
      </section>
    </main>
  );
}

export default MenuDetail;