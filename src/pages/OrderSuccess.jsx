function OrderSuccess({ onBackToOrder, onGoBill }) {
  return (
    <main className="p2-order-success-page">
      <section className="p2-order-success-card">
        <div className="p2-order-success-check">✓</div>

        <h1 className="p2-order-success-title">ยืนยันคำสั่งซื้อสำเร็จ</h1>

        <button
          type="button"
          className="p2-order-success-btn p2-order-success-red"
          onClick={onBackToOrder}
        >
          กลับสู่หน้าสั่งอาหาร
        </button>

        <button
          type="button"
          className="p2-order-success-btn p2-order-success-gray"
          onClick={onGoBill}
        >
          ประวัติการสั่งซื้อ
        </button>
      </section>
    </main>
  );
}

export default OrderSuccess;