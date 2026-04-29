import "../styles/person3-payment-review.css";

function PaymentSummary({
  tableOrders = [],
  billTotal = 0,
  paymentMethod,
  selectedTable,
  customer,
  onBack,
  onConfirmPayment,
}) {
  const itemCount = tableOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
    );
  }, 0);

  function handleConfirmClick() {
    if (typeof onConfirmPayment !== "function") {
      alert("ยังไม่ได้เชื่อมฟังก์ชันยืนยันการชำระเงิน");
      return;
    }

    onConfirmPayment();
  }

  return (
    <main className="p3-page">
      <section className="p3-payment-card">
        <h1 className="p3-title">สรุปการชำระเงิน</h1>

        <div className="p3-payment-detail">
          <p>
            <strong>โต๊ะ:</strong> {selectedTable?.TNumber || "-"}
          </p>

          <p>
            <strong>ลูกค้า:</strong>{" "}
            {customer?.MFirstName
              ? `${customer.MFirstName} ${customer.MSurName}`
              : customer?.name || "ลูกค้าทั่วไป"}
          </p>

          <p>
            <strong>จำนวนรายการ:</strong> {itemCount} รายการ
          </p>

          <p>
            <strong>ช่องทางชำระเงิน:</strong> {paymentMethod || "-"}
          </p>
        </div>

        <div className="p3-payment-total">
          <span>ยอดชำระทั้งหมด</span>
          <strong>{billTotal} บาท</strong>
        </div>

        <div className="p3-actions-row">
          <button
            type="button"
            className="p3-btn p3-btn-gray"
            onClick={onBack}
          >
            ย้อนกลับ
          </button>

          <button
            type="button"
            className="p3-btn p3-btn-green"
            onClick={handleConfirmClick}
          >
            ยืนยันการชำระเงิน
          </button>
        </div>
      </section>
    </main>
  );
}

export default PaymentSummary;
