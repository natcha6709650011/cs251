import React, { useMemo } from "react";
import "../styles/person3-payment-review.css";

function PaymentSummary({
  tableOrders = [],
  billTotal = 0,
  paymentMethod = "-",
  selectedTable,
  customer,
  onBack,
  onConfirmPayment,
}) {
  // 1. ใช้ useMemo คำนวณจำนวนรายการทั้งหมดเพื่อประสิทธิภาพ
  const totalItemCount = useMemo(() => {
    return tableOrders.reduce((sum, order) => {
      const orderQuantity = order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0;
      return sum + orderQuantity;
    }, 0);
  }, [tableOrders]);

  // 2. จัดรูปแบบชื่อลูกค้าให้พร้อมแสดงผล
  const customerDisplayName = useMemo(() => {
    if (customer?.MFirstName) return `${customer.MFirstName} ${customer.MSurName}`;
    return customer?.name || "ลูกค้าทั่วไป";
  }, [customer]);

  const handleConfirmClick = () => {
    if (typeof onConfirmPayment !== "function") {
      return console.error("Payment confirmation function is missing.");
    }
    onConfirmPayment();
  };

  return (
    <main className="p3-payment-summary-page">
      <section className="p3-payment-summary-card">
        <header>
          <h1 className="p3-payment-summary-title">สรุปการชำระเงิน</h1>
        </header>

        {/* 3. ใช้ Description List สำหรับข้อมูลที่เป็น Label: Value */}
        <dl className="p3-payment-summary-detail">
          <div className="p3-detail-row">
            <dt>โต๊ะ:</dt>
            <dd>{selectedTable?.TNumber || selectedTable?.number || "-"}</dd>
          </div>

          <div className="p3-detail-row">
            <dt>ลูกค้า:</dt>
            <dd>{customerDisplayName}</dd>
          </div>

          <div className="p3-detail-row">
            <dt>จำนวนรายการ:</dt>
            <dd>{totalItemCount.toLocaleString()} รายการ</dd>
          </div>

          <div className="p3-detail-row">
            <dt>ช่องทางชำระเงิน:</dt>
            <dd className="p3-highlight-text">{paymentMethod}</dd>
          </div>
        </dl>

        <div className="p3-payment-summary-total">
          <span>ยอดชำระทั้งหมด</span>
          <strong className="p3-total-amount">
            {billTotal.toLocaleString()} บาท
          </strong>
        </div>

        <footer className="p3-payment-summary-actions">
          <button
            type="button"
            className="p3-btn-secondary"
            onClick={onBack}
          >
            ย้อนกลับ
          </button>

          <button
            type="button"
            className="p3-btn-primary"
            onClick={handleConfirmClick}
            disabled={billTotal <= 0}
          >
            ยืนยันการชำระเงิน
          </button>
        </footer>
      </section>
    </main>
  );
}

export default PaymentSummary;