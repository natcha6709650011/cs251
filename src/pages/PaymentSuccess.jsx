import React from "react";

export default function PaymentSuccess({
  customerType,
  reviewCode,
  reviewUrl,
  qrValue,
  onGoReview,
  onClearTable,
  onBackHome,
}) {
  const finalReviewUrl =
    reviewUrl ||
    qrValue ||
    (reviewCode
      ? '${window.location.origin}/review/${encodeURIComponent(reviewCode)}'
      : "");

  const hasReviewQR = finalReviewUrl && finalReviewUrl.length > 0;

  function handleBackHome() {
    if (onClearTable) {
      onClearTable();
    }

    if (onBackHome) {
      onBackHome();
    } else {
      window.location.href = "/";
    }
  }

  function handleOpenReview() {
    if (onGoReview) {
      onGoReview();
      return;
    }

    if (finalReviewUrl) {
      window.location.href = finalReviewUrl;
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.checkCircle}>✓</div>

        <h1 style={styles.title}>ชำระเงินสำเร็จ</h1>
        <p style={styles.subtitle}>ขอบคุณที่ใช้บริการ</p>

        {hasReviewQR ? (
          <div style={styles.qrBox}>
            <h2 style={styles.qrTitle}>สแกน QR เพื่อประเมินความพึงพอใจ</h2>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                finalReviewUrl
              )}`}
              alt="Review QR Code"
              style={styles.qrImage}
            />

            <p style={styles.qrText}>สำหรับลูกค้า Member</p>

            <button
              type="button"
              style={styles.reviewButton}
              onClick={handleOpenReview}
            >
              เปิดแบบประเมิน
            </button>
          </div>
        ) : (
          <div style={styles.noQrBox}>
            <p style={styles.noQrText}>ไม่มี QR สำหรับแบบประเมิน</p>
          </div>
        )}

        <button type="button" style={styles.homeButton} onClick={handleBackHome}>
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
    padding: "40px 16px",
    boxSizing: "border-box",
    background: "#f7f1e8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "min(92vw, 520px)",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "32px 24px",
    boxSizing: "border-box",
    textAlign: "center",
    boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
    border: "2px solid #222",
  },
  checkCircle: {
    width: "96px",
    height: "96px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    border: "6px solid #35a852",
    color: "#35a852",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "56px",
    fontWeight: "bold",
    lineHeight: 1,
  },
  title: {
    margin: "0 0 8px",
    fontSize: "34px",
    fontWeight: 800,
    color: "#111",
  },
  subtitle: {
    margin: "0 0 20px",
    fontSize: "20px",
    color: "#333",
  },
  qrBox: {
    marginTop: "18px",
    padding: "18px 12px",
    borderRadius: "20px",
    background: "#fafafa",
    border: "1px solid #eeeeee",
  },
  qrTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#111",
  },
  qrImage: {
    width: "220px",
    height: "220px",
    maxWidth: "80vw",
    objectFit: "contain",
    borderRadius: "12px",
    background: "#ffffff",
    padding: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
  },
  qrText: {
    margin: "12px 0 14px",
    fontSize: "16px",
    color: "#555",
  },
  reviewButton: {
    border: "none",
    background: "#35a852",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "12px 22px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
  },
  noQrBox: {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "18px",
    background: "#fafafa",
    border: "1px solid #eeeeee",
  },
  noQrText: {
    margin: 0,
    fontSize: "18px",
    color: "#777",
  },
  homeButton: {
    marginTop: "22px",
    border: "none",
    background: "#2f80ed",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "14px 26px",
    fontSize: "18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(47,128,237,0.25)",
  },
};