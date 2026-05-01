import React, { useMemo } from "react";
import "../styles/person3-payment-review.css";

// 1. แยก Logic การจัดรูปแบบ Option ออกไปข้างนอกเพื่อให้อ่านง่าย
const formatItemOptions = (options = {}) => {
  const labels = {
    size: "ปริมาณ:",
    drinkType: "ประเภท:",
    sweetness: "ระดับความหวาน:",
    topping: "ท็อปปิ้ง:",
    note: "เพิ่มเติม:",
  };

  return Object.entries(options)
    .map(([key, value]) => {
      if (!value) return null;
      let displayValue = value;
      if (key === "sweetness") displayValue = `หวาน ${value}`;
      if (key === "note") displayValue = value;
      return { label: labels[key] || key, value: displayValue };
    })
    .filter(Boolean);
};

// 2. สร้าง Sub-component เล็กๆ เพื่อลดความซับซ้อนของ JSX หลัก
const BillItem = ({ item }) => {
  const options = formatItemOptions(item.options);
  const totalPrice = (item.finalPrice || 0) * (item.quantity || 1);

  return (
    <div className="p3-bill-order-card">
      <div className="p3-bill-order-img">
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" />
        ) : (
          <div className="p3-bill-placeholder">ไม่มีรูป</div>
        )}
      </div>

      <div className="p3-bill-order-info">
        <div className="p3-bill-order-row">
          <span>ชื่อเมนู:</span>
          <strong>{item.name}</strong>
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
      order.items.map((item) => ({
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