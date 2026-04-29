import { QRCodeCanvas } from "qrcode.react";
import "../styles/person3-payment-review.css";

function PaymentSuccess({ customerType, reviewCode, onClearTable, onGoReview }) {
  const baseUrl = window.location.origin;
  const reviewUrl = reviewCode ? `${baseUrl}/review/${reviewCode}` : "";

  return (
    <main className="p3-page">
      <section className="p3-success-card">
        <div className="p3-success-icon">✓</div>

        <h1 className="p3-success-title">ชำระเงินสำเร็จ</h1>

        {customerType === "Member" && reviewCode ? (
          <>
            <p className="p3-success-text">
              กรุณาให้ลูกค้าสแกน QR Code เพื่อทำแบบประเมิน
            </p>

            <div className="p3-qr-box">
              <QRCodeCanvas
                value={reviewUrl}
                size={190}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="p3-review-link-box">
              <p>Review Code</p>
              <strong>{reviewCode}</strong>
            </div>

            <button
              type="button"
              className="p3-btn p3-btn-yellow"
              onClick={onGoReview}
            >
              เปิดหน้ารีวิวในเครื่องนี้
            </button>
          </>
        ) : (
          <p className="p3-success-text">ขอบคุณที่ใช้บริการ</p>
        )}

        <button
          type="button"
          className="p3-btn p3-btn-blue p3-mt"
          onClick={onClearTable}
        >
          กลับสู่หน้าเลือกประเภทลูกค้า
        </button>
      </section>
    </main>
  );
}

export default PaymentSuccess;
