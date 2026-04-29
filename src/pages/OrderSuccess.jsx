// src/pages/OrderSuccess.jsx
import "../styles/person2-order.css";

function OrderSuccess({ onBackToOrder, onGoBill }) {
  return (
    <main className="p2-success-container">
      <section className="p2-success-card">
        {/* วงกลมเครื่องหมายถูก */}
        <div className="p2-success-icon-wrapper">
          <div className="p2-success-check">✓</div>
        </div>

        <h1 className="p2-success-title">ยืนยันคำสั่งซื้อสำเร็จ</h1>
        <p className="p2-success-subtitle">ออร์เดอร์ของคุณถูกส่งไปยังห้องครัวเรียบร้อยแล้ว</p>

        <div className="p2-success-button-group">
          <button
            type="button"
            className="p2-success-btn p2-btn-green"
            onClick={onBackToOrder}
          >
            กลับสู่หน้าสั่งอาหาร
          </button>

          <button
            type="button"
            className="p2-success-btn p2-btn-red"
            onClick={onGoBill}
          >
            ประวัติการสั่งซื้อ
          </button>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;