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
    <main className="p1-page">
      <section style={{ width: "80%", margin: "40px auto" }}>
        <h1>ตะกร้าของคุณ</h1>

        {cart.length === 0 ? (
          <p>ยังไม่มีรายการในตะกร้า</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.cartId}
              style={{
                border: "1px solid #111",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                background: "#fff",
              }}
            >
              <h3>{item.name}</h3>
              <p>ราคา: {item.finalPrice} บาท</p>
              <p>จำนวน: {item.quantity}</p>

              <button onClick={() => onDecrease(item.cartId)}>-</button>
              <button onClick={() => onIncrease(item.cartId)}>+</button>
              <button onClick={() => onRemove(item.cartId)}>ลบ</button>
            </div>
          ))
        )}

        <h2>ราคารวม {cartTotal} บาท</h2>

        <button onClick={onBack}>กลับไปสั่งอาหาร</button>
        <button onClick={onConfirmOrder}>ยืนยันคำสั่งซื้อ</button>
      </section>
    </main>
  );
}

export default Cart;