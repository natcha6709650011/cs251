import React from "react";

export default function ThankYou({ customer }) {
  const firstName =
    customer?.firstName ||
    customer?.MFirstName ||
    customer?.name ||
    customer?.customerName ||
    "";

  const lastName =
    customer?.lastName ||
    customer?.MSurName ||
    customer?.surname ||
    "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <div style={styles.iconCircle}>
            <span style={styles.icon}>✓</span>
          </div>
        </div>

        <h1 style={styles.title}>ขอบคุณสำหรับความคิดเห็นของคุณ!</h1>
        <p style={styles.subtitle}>ระบบได้รับแบบประเมินเรียบร้อยแล้ว</p>

        <div style={styles.nameBox}>
          <div style={styles.nameLabel}>ผู้ส่งแบบประเมิน</div>
          <div style={styles.nameValue}>
            {fullName ? `คุณ${fullName}` : "ลูกค้า"}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px 40px",
    background: "#f7f1e8",
    boxSizing: "border-box",
  },
  card: {
    width: "min(92vw, 430px)",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "32px 24px",
    boxSizing: "border-box",
    textAlign: "center",
    boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
    border: "1px solid rgba(0,0,0,0.06)",
  },
  iconWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "18px",
  },
  iconCircle: {
    width: "110px",
    height: "110px",
    borderRadius: "999px",
    border: "6px solid #57b35f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  icon: {
    fontSize: "58px",
    fontWeight: 700,
    color: "#57b35f",
    lineHeight: 1,
  },
  title: {
    margin: "0 0 12px",
    fontSize: "clamp(28px, 4.5vw, 42px)",
    fontWeight: 800,
    lineHeight: 1.25,
    color: "#1d1d1d",
  },
  subtitle: {
    margin: "0 0 22px",
    fontSize: "clamp(16px, 3vw, 20px)",
    lineHeight: 1.5,
    color: "#666666",
  },
  nameBox: {
    background: "#f6f7f9",
    borderRadius: "18px",
    padding: "16px 18px",
  },
  nameLabel: {
    fontSize: "14px",
    color: "#7c7c7c",
    marginBottom: "8px",
  },
  nameValue: {
    fontSize: "clamp(22px, 4vw, 30px)",
    fontWeight: 700,
    color: "#222222",
    lineHeight: 1.3,
    wordBreak: "break-word",
  },
};