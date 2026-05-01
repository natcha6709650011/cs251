import React, { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/person3-payment-review.css";

function PaymentSuccess({ 
  customerType, 
  reviewCode, 
  onClearTable, 
  onGoReview 
}) {
  const reviewUrl = useMemo(() => {
    if (!reviewCode) return "";
    return `${window.location.origin}/review/${reviewCode}`;
  }, [reviewCode]);

  return (
    <main className="p3-page"> {/* กลับมาใช้ p3-page */}
      <section className="p3-success-card"> {/* ใช้ชื่อเดิม */}
        <div className="p3-success-icon">✓</div>
        <h1 className="p3-success-title">ชำระเงินสำเร็จ</h1>

        {customerType === "Member" ? (
          <>
            <p className="p3-success-text">
              กรุณาให้ลูกค้าสแกน QR Code เพื่อทำแบบประเมิน
            </p>

            <div className="p3-qr-box"> {/* ใช้ชื่อเดิม */}
              {reviewCode ? (
                <QRCodeCanvas
                  value={reviewUrl}
                  size={190}
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <p>ไม่พบรหัสรีวิว</p>
              )}
            </div>

            <div className="p3-review-link-box"> {/* ชื่อเดิม */}
              <p>Review Code</p>
              <strong>{reviewCode}</strong>
            </div>

            <button
              type="button"
              className="p3-btn p3-btn-yellow" /* กลับมาใช้ btn-yellow */
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
          className="p3-btn p3-btn-blue p3-mt" /* กลับมาใช้ btn-blue */
          onClick={onClearTable}
        >
          กลับสู่หน้าหลัก
        </button>
      </section>
    </main>
  );
}

export default PaymentSuccess;