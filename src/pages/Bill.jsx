import React, { useMemo } from "react";
import { menus } from "../data/menuData";
import "../styles/person3-payment-review.css";

const normalizeMenuId = (value = "") => {
  const text = String(value || "").trim();
  const onlyDigits = text.replace(/\D/g, "");
  return onlyDigits ? onlyDigits.padStart(3, "0") : text;
};

const findMenuFromData = (item = {}) => {
  const itemMenuId = normalizeMenuId(
    item.menuId ||
      item.MenuId ||
      item.MenuID ||
      item.menuID ||
      item.id ||
      item.ID
  );

  const itemName = String(
    item.name ||
      item.Name ||
      item.MenuName ||
      item.menuName ||
      item.menu_name ||
      item.Menuname ||
      item.menuname ||
      ""
  ).trim();

  return menus.find((menu) => {
    const menuId = normalizeMenuId(
      menu.id ||
        menu.menuId ||
        menu.MenuId ||
        menu.MenuID ||
        menu.menuID
    );

    const menuName = String(
      menu.name ||
        menu.Name ||
        menu.MenuName ||
        menu.menuName ||
        menu.menu_name ||
        ""
    ).trim();

    return (
      (itemMenuId && menuId === itemMenuId) ||
      (itemName && menuName && menuName === itemName)
    );
  });
};

const getBillItemName = (item = {}) => {
  const localMenu = findMenuFromData(item);

  return (
    item.name ||
    item.Name ||
    item.MenuName ||
    item.menuName ||
    item.menu_name ||
    item.Menuname ||
    item.menuname ||
    localMenu?.name ||
    localMenu?.MenuName ||
    localMenu?.menuName ||
    "ไม่พบชื่อเมนู"
  );
};

const getBillItemImage = (item = {}) => {
  const localMenu = findMenuFromData(item);

  return (
    item.image ||
    item.Image ||
    item.img ||
    item.Img ||
    item.imageUrl ||
    item.ImageUrl ||
    item.MenuImage ||
    item.menuImage ||
    localMenu?.image ||
    localMenu?.Image ||
    localMenu?.img ||
    ""
  );
};

const getBillItemPrice = (item = {}) =>
  Number(
    item.finalPrice ||
      item.price ||
      item.Price ||
      item.unitPrice ||
      item.UnitPrice ||
      0
  );

const getBillItemQuantity = (item = {}) =>
  Number(item.quantity || item.Quantity || 1);

const formatItemOptions = (options = {}) => {
  const rows = [];

  if (options.size && options.size !== "ธรรมดา") {
    rows.push({ label: "ปริมาณ:", value: options.size });
  }

  if (options.drinkType) {
    rows.push({ label: "ประเภท:", value: options.drinkType });
  }

if (options.sweetness) {
  rows.push({ label: "ระดับความหวาน:", value: `หวาน ${options.sweetness}` });
}

  if (options.topping) {
    rows.push({ label: "ท็อปปิ้ง:", value: options.topping });
  }

  if (Array.isArray(options.toppings) && options.toppings.length > 0) {
    rows.push({ label: "ท็อปปิ้ง:", value: options.toppings.join(", ") });
  } else if (
    typeof options.toppings === "string" &&
    options.toppings.trim() &&
    options.toppings.trim().toLowerCase() !== "toppings"
  ) {
    rows.push({ label: "ท็อปปิ้ง:", value: options.toppings.trim() });
  }

  if (options.note) {
    rows.push({ label: "เพิ่มเติม:", value: options.note });
  }

  return rows;
};

const BillItem = ({ item }) => {
  const itemName = getBillItemName(item);
  const itemImage = getBillItemImage(item);
  const options = formatItemOptions(item.options || {});
  const totalPrice = getBillItemPrice(item) * getBillItemQuantity(item);

  return (
    <div className="p3-bill-order-card">
      <div className="p3-bill-order-img">
        {itemImage ? (
          <img src={itemImage} alt={itemName} loading="lazy" />
        ) : (
          <div className="p3-bill-placeholder">ไม่มีรูป</div>
        )}
      </div>

      <div className="p3-bill-order-info">
        <div className="p3-bill-order-row">
          <span>ชื่อเมนู:</span>
          <strong>{itemName}</strong>
        </div>

        {options.map(({ label, value }) => (
          <div className="p3-bill-order-row" key={`${label}-${value}`}>
            <span>{label}</span>
            <p>{value}</p>
          </div>
        ))}

        <div className="p3-bill-order-row">
          <span>ราคา:</span>
          <p className="p3-bill-item-price">
            {totalPrice.toLocaleString()} บาท
          </p>
        </div>
      </div>
    </div>
  );
};

function Bill({
  tableOrders = [],
  billTotal = 0,
  onBack,
  onSelectPayment,
}) {
  const allItems = useMemo(
    () =>
      tableOrders.flatMap((order) =>
        (order.items || []).map((item) => ({
          ...item,
          orderId: order.orderId || order.OId,
        }))
      ),
    [tableOrders]
  );

  const PAYMENT_METHODS = [
    { id: "cash", label: "เงินสด", className: "p3-payment-cash" },
    { id: "qr", label: "สแกนคิวอาร์โค้ด", className: "p3-payment-qr" },
    { id: "card", label: "บัตรเครดิต/เดบิต", className: "p3-payment-card" },
  ];

  return (
    <main className="p3-bill-page">
      <section className="p3-bill-layout">
        <div className="p3-bill-left">
          <header>
            <h1 className="p3-bill-heading">ประวัติคำสั่งซื้อ</h1>
          </header>

          <div className="p3-bill-order-box">
            <div className="p3-bill-scroll">
              {allItems.length === 0 ? (
                <div className="p3-bill-empty">ยังไม่มีรายการอาหารในบิล</div>
              ) : (
                allItems.map((item, index) => (
                  <BillItem
                    key={`${item.orderId || "order"}-${
                      item.cartId || item.OD_Id || item.menuId || item.MenuId || index
                    }`}
                    item={item}
                  />
                ))
              )}
            </div>

            <div className="p3-bill-total-line">
              <span>ราคารวม</span>
              <strong className="p3-total-amount">
                {Number(billTotal || 0).toLocaleString()}
              </strong>
              <span>บาท</span>
            </div>
          </div>
        </div>

        <aside className="p3-bill-payment-panel">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              className={`p3-payment-method ${method.className}`}
              onClick={() => onSelectPayment(method.label)}
            >
              {method.label}
            </button>
          ))}
        </aside>
      </section>

      <button
        type="button"
        className="p3-bill-back-btn"
        onClick={onBack}
      >
        ← กลับสู่หน้าสั่งอาหาร
      </button>
    </main>
  );
}

export default Bill;