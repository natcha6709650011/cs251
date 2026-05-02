import React, { useMemo } from "react";
import * as menuModule from "../data/menuData";
import "../styles/person3-payment-review.css";


const menuData = menuModule.default || menuModule.menuData || [];

const normalizeMenuId = (value = "") =>
  String(value || "").replace(/\D/g, "").padStart(3, "0");

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

  return menuData.find((menu) => {
    const menuId = normalizeMenuId(
      menu.menuId ||
        menu.MenuId ||
        menu.MenuID ||
        menu.menuID ||
        menu.id ||
        menu.ID
    );

    const menuName = String(
      menu.name ||
        menu.Name ||
        menu.MenuName ||
        menu.menuName ||
        menu.menu_name ||
        menu.Menuname ||
        menu.menuname ||
        ""
    ).trim();

    return (
      (itemMenuId && menuId === itemMenuId) ||
      (itemName && menuName && menuName === itemName)
    );
  });
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
    item.MenuImg ||
    item.menuImg ||
    localMenu?.image ||
    localMenu?.Image ||
    localMenu?.img ||
    localMenu?.Img ||
    localMenu?.imageUrl ||
    ""
  );
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
    item.Menu ||
    localMenu?.name ||
    localMenu?.MenuName ||
    localMenu?.menuName ||
    "ไม่พบชื่อเมนู"
  );
};

// 1. แยก Logic การจัดรูปแบบ Option ออกไปข้างนอกเพื่อให้อ่านง่าย
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

// 2. สร้าง Sub-component เล็กๆ เพื่อลดความซับซ้อนของ JSX หลัก
const BillItem = ({ item }) => {
  const image = getBillItemImage(item);
  const name = getBillItemName(item) || item.name;
  const options = formatItemOptions(item.options);
  const totalPrice = (item.finalPrice || item.price || item.UnitPrice || item.unitPrice || 0) * (item.quantity || item.Quantity || 1);

  return (
    <div className="p3-bill-order-card">
      <div className="p3-bill-order-img">
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <div className="p3-bill-placeholder">ไม่มีรูป</div>
        )}
      </div>

      <div className="p3-bill-order-info">
        <div className="p3-bill-order-row">
          <span>ชื่อเมนู:</span>
          <strong>{name}</strong>
        </div>

        {options.map(({ label, value }) => (
          <div className="p3-bill-order-row" key={label}>
            <span>{label}</span>
            <p>{value}</p>
          </div>
        ))}

        <div className="p3-bill-order-row">
          <span>ราคา:</span>
          <p className="p3-bill-item-price">{totalPrice.toLocaleString()} บาท</p>
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
  // 3. ใช้ useMemo ป้องกันการคำนวณใหม่โดยไม่จำเป็น
  const allItems = useMemo(() => 
    tableOrders.flatMap((order) =>
      (order.items || []).map((item) => ({
        ...item,
        orderId: order.orderId,
      }))
    ), [tableOrders]
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
                allItems.map((item) => (
                  <BillItem 
                    key={`${item.orderId}-${item.cartId}`} 
                    item={item} 
                  />
                ))
              )}
            </div>

            <div className="p3-bill-total-line">
              <span>ราคารวม</span>
              <strong className="p3-total-amount">
                {billTotal.toLocaleString()}
              </strong>
              <span>บาท</span>
            </div>
          </div>

        </div>

        {/* 4. ใช้ aside สำหรับส่วนประกอบรอง */}
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