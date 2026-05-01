import "../styles/person2-order.css";

function Cart({
  cart = [],
  cartTotal = 0,
  onBack,
  onConfirmOrder,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <main className="p2-cart-page">
      <section className="p2-cart-inner">
        <h1 className="p2-cart-title">ตะกร้าของคุณ</h1>

        {cart.length === 0 ? (
          <p className="p2-cart-empty">ยังไม่มีรายการในตะกร้า</p>
        ) : (
          cart.map((item) => (
            <div key={item.cartId} className="p2-cart-item">
              <div className="p2-cart-item-info">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="p2-cart-item-img"
                  />
                )}
                <div className="p2-cart-item-details">
                  <h3 className="p2-cart-item-name">{item.name}</h3>
                  {item.options?.size && (
                    <p className="p2-cart-item-option">ปริมาณ: {item.options.size}</p>
                  )}
                  {item.options?.drinkType && (
                    <p className="p2-cart-item-option">รูปแบบ: {item.options.drinkType}</p>
                  )}
                  {item.options?.sweetness && (
                    <p className="p2-cart-item-option">ความหวาน: {item.options.sweetness}</p>
                  )}
                  {item.options?.toppings?.length > 0 && (
                    <p className="p2-cart-item-option">ท็อปปิ้ง: {item.options.toppings.join(", ")}</p>
                  )}
                  {item.options?.note && (
                    <p className="p2-cart-item-option">หมายเหตุ: {item.options.note}</p>
                  )}
                  <p className="p2-cart-item-price">{item.finalPrice} บาท</p>
                </div>
              </div>

              <div className="p2-cart-item-controls">
                <button
                  type="button"
                  className="p2-qty-btn"
                  onClick={() => onDecrease(item.cartId)}
                >
                  −
                </button>
                <span className="p2-qty-number">{item.quantity}</span>
                <button
                  type="button"
                  className="p2-qty-btn"
                  onClick={() => onIncrease(item.cartId)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="p2-remove-btn"
                  onClick={() => onRemove(item.cartId)}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        )}

        <div className="p2-cart-footer">
          <p className="p2-cart-total">ยอดรวม: {cartTotal} บาท</p>
          <div className="p2-cart-btn-group">
            <button type="button" className="p2-cart-btn p2-cart-btn-back" onClick={onBack}>
              กลับไปสั่งอาหาร
            </button>
            <button type="button" className="p2-cart-btn p2-cart-btn-confirm" onClick={onConfirmOrder}>
              ยืนยันคำสั่งซื้อ
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Cart;