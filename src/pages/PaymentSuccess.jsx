import React from "react";

export default function PaymentSuccess({
  paymentMethod,
  total,
  reviewCode,
  reviewUrl,
  qrValue,
  onClearTable,
  onGoReview,
}) {
  const finalReviewUrl =
    reviewUrl ||
    qrValue ||
    (reviewCode
      ? `${window.location.origin}/review/${encodeURIComponent(reviewCode)}`
      : "");

  const hasQR = Boolean(finalReviewUrl);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.check}>✓</div>

        <h1 style={styles.title}>ชำระเงินสำเร็จ</h1>
        <p style={styles.text}>ขอบคุณที่ใช้บริการ</p>

        {paymentMethod && (
          <p style={styles.detail}>วิธีชำระเงิน: {paymentMethod}</p>
        )}

        {total !== undefined && total !== null && (
          <p style={styles.detail}>ยอดรวม: {total} บาท</p>
        )}

        {hasQR ? (
          <div style={styles.qrBox}>
            <h2 style={styles.qrTitle}>สแกน QR เพื่อประเมิน</h2>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                finalReviewUrl
              )}`}
              alt="QR Review"
              style={styles.qr}
            />

            <p style={styles.codeText}>Review Code: {reviewCode}</p>

            <button
              type="button"
              style={styles.reviewButton}
              onClick={() => {
                if (onGoReview) onGoReview();
              }}
            >
              เปิดแบบประเมิน
            </button>
          </div>
        ) : (
          <p style={styles.noQr}>ไม่มี QR สำหรับแบบประเมิน</p>
        )}

        <button
          type="button"
          style={styles.homeButton}
          onClick={() => {
            if (onClearTable) onClearTable();
          }}
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#f7f1e8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
  },
  card: {
    width: "500px",
    maxWidth: "92vw",
    background: "#fff",
    border: "2px solid #222",
    borderRadius: "28px",
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  },
  check: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "6px solid #35a852",
    color: "#35a852",
    fontSize: "54px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 18px",
  },
  title: {
    fontSize: "34px",
    margin: "0 0 8px",
    fontWeight: 800,
  },
  text: {
    fontSize: "20px",
    margin: "0 0 12px",
  },
  detail: {
    fontSize: "18px",
    margin: "4px 0",
    color: "#333",
  },
  qrBox: {
    marginTop: "16px",
    padding: "16px",
    background: "#fafafa",
    borderRadius: "18px",
    border: "1px solid #eee",
  },
  qrTitle: {
    fontSize: "22px",
    margin: "0 0 14px",
    fontWeight: 800,
  },
  qr: {
    width: "220px",
    height: "220px",
    maxWidth: "80vw",
    background: "#fff",
    borderRadius: "12px",
    padding: "8px",
  },
  codeText: {
    margin: "10px 0 0",
    fontSize: "14px",
    color: "#666",
    wordBreak: "break-all",
  },
  reviewButton: {
    display: "block",
    margin: "14px auto 0",
    background: "#35a852",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "12px 22px",
    fontSize: "18px",
    fontWeight: 700,
  },
  noQr: {
    fontSize: "18px",
    color: "#777",
    margin: "18px 0",
  },
  homeButton: {
    marginTop: "22px",
    background: "#2f80ed",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 26px",
    fontSize: "18px",
    fontWeight: 800,
  },
};
