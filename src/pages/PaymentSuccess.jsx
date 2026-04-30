import React, { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/person3-payment-review.css";

function PaymentSuccess({ 
  customerType, 
  reviewCode, 
  onClearTable, 
  onGoReview 
}) {
  // 1. ใช้ useMemo เพื่อจัดการ URL ให้เสร็จสรรพ ลด logic ในส่วน return
  const reviewUrl = useMemo(() => {
    if (!reviewCode) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/review/${reviewCode}`;
  }, [reviewCode]);

  const isMember = customerType === "Member";

  return (
    <main className="p3-payment-success-page">
      <section className="p3-payment-success-card">
        {/* ส่วนหัวแสดงสถานะ */}
        <div className="p3-success-status">
          <div className="p3-success-icon" aria-hidden="true">✓</div>
          <h1 className="p3-success-title">ชำระเงินสำเร็จ</h1>
        </div>

        {/* 2. การจัดการเงื่อนไขการแสดงผล QR Code สำหรับ Member */}
        {isMember ? (
          <div className="p3-member-review-section">
            {reviewCode ? (
              <>
                <p className="p3-success-instruction">
                  กรุณาให้ลูกค้าสแกน QR Code เพื่อทำแบบประเมิน
                </p>

                <div className="p3-qr-container">
                  <QRCodeCanvas
                    value={reviewUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    aria-label={`QR Code for review URL: ${reviewUrl}`}
                  />
                </div>

                <div className="p3-review-code-display">
                  <small>Review Code</small>
                  <p className="p3-code-text">{reviewCode}</p>
                </div>

                <button
                  type="button"
                  className="p3-btn-action p3-btn-review-now"
                  onClick={onGoReview}
                >
                  เปิดหน้ารีวิวในเครื่องนี้
                </button>
              </>
            ) : (
              <p className="p3-error-text">ไม่พบรหัสรีวิว กรุณาติดต่อผู้ดูแลระบบ</p>
            )}
          </div>
        ) : (
          <div className="p3-general-thanks">
            <p className="p3-success-text">ขอบคุณที่ใช้บริการ</p>
          </div>
        )}

        {/* ปุ่มหลักสำหรับเคลียร์โต๊ะ */}
        <footer className="p3-success-footer">
          <button
            type="button"
            className="p3-btn-main p3-btn-clear-table"
            onClick={onClearTable}
          >
            กลับสู่หน้าเลือกประเภทลูกค้า
          </button>
        </footer>
      </section>
    </main>
  );
}

export default PaymentSuccess;