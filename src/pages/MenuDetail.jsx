import "../styles/person2-order.css";
import { menus as menuData } from "../data/menuData";

export default function MenuDetail({
  selectedMenu,
  menuOptions,
  setMenuOptions,
  onAddToCart,
  onBack,
}) {
  if (!selectedMenu) return null;

  const updateOption = (key, value) => {
    setMenuOptions((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTopping = (topping) => {
    setMenuOptions((prev) => {
      const currentToppings = Array.isArray(prev.toppings)
        ? prev.toppings
        : prev.topping
        ? [prev.topping]
        : [];

      const alreadySelected = currentToppings.includes(topping);

      return {
        ...prev,
        topping: "",
        toppings: alreadySelected
          ? currentToppings.filter((item) => item !== topping)
          : [...currentToppings, topping],
      };
    });
  };

  const isToppingSelected = (topping) => {
    const currentToppings = Array.isArray(menuOptions.toppings)
      ? menuOptions.toppings
      : menuOptions.topping
      ? [menuOptions.topping]
      : [];

    return currentToppings.includes(topping);
  };

  const clearToppings = () => {
    setMenuOptions((prev) => ({
      ...prev,
      topping: "",
      toppings: [],
    }));
  };

  const originalMenu = menuData.find(
    (menu) =>
      String(menu.id) === String(selectedMenu.id) ||
      menu.name === selectedMenu.name
  );

  const imageSrc =
    selectedMenu.image && selectedMenu.image.trim() !== ""
      ? selectedMenu.image
      : originalMenu?.image || "";

  return (
    <div className="p2-detail-container">
      <div className="p2-detail-card">
        <button className="p2-back-btn" onClick={onBack}>
          ‹
        </button>

        <div className="p2-detail-left">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={selectedMenu.name}
              className="p2-detail-img"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/320x320?text=Image";
              }}
            />
          ) : (
            <div className="p2-detail-img p2-detail-img-empty">ใส่รูป</div>
          )}

          <h2 className="p2-detail-title">{selectedMenu.name}</h2>
        </div>

        <div className="p2-detail-right">
          <div className="p2-options-scroll">
            {(selectedMenu.optionType === "food" ||
              selectedMenu.optionType === "snack") && (
              <>
                <div className="p2-option-group">
                  <h4>ปริมาณ</h4>

                  <label className="p2-choice-row">
                    <input
                      type="radio"
                      name="size"
                      checked={menuOptions.size === "ธรรมดา"}
                      onChange={() => updateOption("size", "ธรรมดา")}
                    />
                    <span>ธรรมดา</span>
                  </label>

                  <label className="p2-choice-row">
                    <input
                      type="radio"
                      name="size"
                      checked={menuOptions.size === "พิเศษ"}
                      onChange={() => updateOption("size", "พิเศษ")}
                    />
                    <span>พิเศษ (+10 บาท)</span>
                  </label>
                </div>

                <div className="p2-option-group">
                  <h4>ท็อปปิ้ง</h4>

                  {selectedMenu.optionType === "food" ? (
                    <>
                      <label className="p2-choice-row">
                        <input
                          type="checkbox"
                          checked={
                            !menuOptions.toppings ||
                            menuOptions.toppings.length === 0
                          }
                          onChange={clearToppings}
                        />
                        <span>ไม่ใส่</span>
                      </label>

                      {["ไข่ดาว", "ไข่เจียว", "ไข่ข้น"].map((topping) => (
                        <label className="p2-choice-row" key={topping}>
                          <input
                            type="checkbox"
                            checked={isToppingSelected(topping)}
                            onChange={() => toggleTopping(topping)}
                          />
                          <span>
                            {topping}{" "}
                            {topping === "ไข่ข้น" ? "(+15.-)" : "(+10.-)"}
                          </span>
                        </label>
                      ))}
                    </>
                  ) : (
                    <label className="p2-choice-row">
                      <input
                        type="checkbox"
                        checked={isToppingSelected("ชีสดิป")}
                        onChange={() => toggleTopping("ชีสดิป")}
                      />
                      <span>ชีสดิป (+10.-)</span>
                    </label>
                  )}
                </div>
              </>
            )}

            {selectedMenu.optionType === "drink" && (
              <>
                <div className="p2-option-group">
                  <h4>ระดับความหวาน</h4>

                  {["100%", "50%", "25%", "0%"].map((sweetness) => (
                    <label className="p2-choice-row" key={sweetness}>
                      <input
                        type="radio"
                        name="sweetness"
                        checked={menuOptions.sweetness === sweetness}
                        onChange={() => updateOption("sweetness", sweetness)}
                      />
                      <span>หวาน {sweetness}</span>
                    </label>
                  ))}
                </div>

                <div className="p2-option-group">
                  <h4>รูปแบบ</h4>

                  {["เย็น", "ปั่น (+5.-)"].map((drinkType) => (
                    <label className="p2-choice-row" key={drinkType}>
                      <input
                        type="radio"
                        name="drinkType"
                        checked={menuOptions.drinkType === drinkType}
                        onChange={() => updateOption("drinkType", drinkType)}
                      />
                      <span>{drinkType}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            <div className="p2-option-group">
              <h4>เพิ่มเติม</h4>

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

        <button className="p2-add-to-cart-btn" onClick={onAddToCart}>
          ยืนยัน
        </button>
      </div>
    </div>
  );
}