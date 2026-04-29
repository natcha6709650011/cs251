import "../styles/person3-payment-review.css";

function formatOptions(options = {}) {
  const rows = [];

  if (options.size) rows.push(["ปริมาณ:", options.size]);
  if (options.drinkType) rows.push(["ประเภท:", options.drinkType]);
  if (options.sweetness) rows.push(["ระดับความหวาน:", `หวาน ${options.sweetness}`]);
  if (options.topping) rows.push(["ท็อปปิ้ง:", options.topping]);
  rows.push(["เพิ่มเติม:", options.note || "-"]);

  return rows;
}

function Bill({
  tableOrders = [],
  billTotal = 0,
  onBack,
  onSelectPayment,
}) {
  const allItems = tableOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order.orderId,
    }))
  );

  return (
    <main className="p3-bill-page">
      <section className="p3-bill-layout">
        <div className="p3-bill-left">
          <h1 className="p3-bill-heading">ประวัติคำสั่งซื้อ</h1>

          <div className="p3-bill-order-box">
            <div className="p3-bill-scroll">
              {allItems.length === 0 ? (
                <div className="p3-bill-empty">
                  ยังไม่มีรายการอาหารในบิล
                </div>
              ) : (
                allItems.map((item) => {
                  const rows = formatOptions(item.options);

                  return (
                    <div
                      className="p3-bill-order-card"
                      key={`${item.orderId}-${item.cartId}`}
                    >
                      <div className="p3-bill-order-img">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>รูป</span>
                        )}
                      </div>

                      <div className="p3-bill-order-info">
                        <div className="p3-bill-order-row">
                          <span>ชื่อเมนู:</span>
                          <strong>{item.name}</strong>
                        </div>

                        {rows.map(([label, value]) => (
                          <div className="p3-bill-order-row" key={label}>
                            <span>{label}</span>
                            <p>{value}</p>
                          </div>
                        ))}

                        <div className="p3-bill-order-row">
                          <span>ราคา:</span>
                          <p>{item.finalPrice * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p3-bill-total-line">
              <span>ราคารวม</span>
              <strong>{billTotal}</strong>
              <span>บาท</span>
            </div>
          </div>

          <button
            type="button"
            className="p3-bill-confirm-btn"
            onClick={() => onSelectPayment("เงินสด")}
          >
            ยืนยัน
          </button>
        </div>

        <div className="p3-bill-payment-panel">
          <button
            type="button"
            className="p3-payment-method p3-payment-cash"
            onClick={() => onSelectPayment("เงินสด")}
          >
            เงินสด
          </button>

          <button
            type="button"
            className="p3-payment-method p3-payment-qr"
            onClick={() => onSelectPayment("สแกนคิวอาร์โค้ด")}
          >
            สแกนคิวอาร์โค้ด
          </button>

          <button
            type="button"
            className="p3-payment-method p3-payment-card"
            onClick={() => onSelectPayment("บัตรเครดิต/เดบิต")}
          >
            บัตรเครดิต/เดบิต
          </button>
        </div>
      </section>

      <button
        type="button"
        className="p3-bill-back-btn"
        onClick={onBack}
      >
        กลับสู่หน้าสั่งอาหาร
      </button>
    </main>
  );
}

export default Bill;