import React, { useMemo, useState } from "react";

function StarRating({ value = 0, onChange }) {
  return (
    <div style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          style={{
            ...styles.starButton,
            color: star <= value ? "#f5b400" : "#d8d8d8",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function average(values, fallback = 5) {
  const nums = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);

  if (nums.length === 0) return fallback;

  return Math.round(nums.reduce((sum, value) => sum + value, 0) / nums.length);
}

export default function ReviewPage({ reviewData, onSubmit }) {
  const menus = reviewData?.menus || [];
  const employees = reviewData?.employees || [];
  const topics = reviewData?.experienceTopics || [];

  const initialMenuRatings = useMemo(() => {
    const result = {};
    menus.forEach((menu, index) => {
      result[menu.menuId || menu.orderId || index] = 0;
    });
    return result;
  }, [menus]);

  const initialEmployeeRatings = useMemo(() => {
    const result = {};
    employees.forEach((employee, index) => {
      result[employee.EId || employee.employeeId || index] = 0;
    });
    return result;
  }, [employees]);

  const initialTopicRatings = useMemo(() => {
    const result = {};
    topics.forEach((topic, index) => {
      const key = topic.id || topic.topicId || topic.name || topic.title || index;
      result[key] = 0;
    });
    return result;
  }, [topics]);

  const [menuRatings, setMenuRatings] = useState(initialMenuRatings);
  const [employeeRatings, setEmployeeRatings] = useState(initialEmployeeRatings);
  const [topicRatings, setTopicRatings] = useState(initialTopicRatings);
  const [comment, setComment] = useState("");

  if (!reviewData) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyCard}>ไม่พบข้อมูลแบบประเมิน</div>
      </div>
    );
  }

  const customerName = [
    reviewData.customer?.MFirstName || reviewData.customer?.firstName,
    reviewData.customer?.MSurName || reviewData.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  function setMenuRating(key, value) {
    setMenuRatings((prev) => ({ ...prev, [key]: value }));
  }

  function setEmployeeRating(key, value) {
    setEmployeeRatings((prev) => ({ ...prev, [key]: value }));
  }

  function setTopicRating(key, value) {
    setTopicRatings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const orderRating = average(Object.values(menuRatings), 5);
    const employeeRating = average(Object.values(employeeRatings), 5);
    const experienceRating = average(Object.values(topicRatings), 5);
    const rating = average([orderRating, employeeRating, experienceRating], 5);

    onSubmit({
      rating,
      orderRating,
      foodRating: orderRating,
      menuRating: orderRating,
      employeeRating,
      serviceRating: employeeRating,
      experienceRating,
      menuRatings,
      employeeRatings,
      topicRatings,
      comment,
      orderComment: comment,
      employeeComment: comment,
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <h1 style={styles.title}>แบบประเมินความพึงพอใจ</h1>
        {customerName && <p style={styles.customer}>คุณ {customerName}</p>}
      </div>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>อาหาร</h2>

        {menus.length === 0 && <p style={styles.muted}>ไม่มีรายการอาหาร</p>}

        {menus.map((menu, index) => {
          const key = menu.menuId || menu.orderId || index;
          const image = menu.image || menu.img || menu.imageUrl || "";
          const name = menu.menuName || menu.name || "เมนู";

          return (
            <div key={key} style={styles.itemCard}>
              {image ? (
                <img src={image} alt={name} style={styles.foodImage} />
              ) : (
                <div style={styles.noImage}>ไม่มีรูป</div>
              )}

              <div style={styles.itemInfo}>
                <div style={styles.itemName}>{name}</div>
                <StarRating
                  value={Number(menuRatings[key] || 0)}
                  onChange={(value) => setMenuRating(key, value)}
                />
              </div>
            </div>
          );
        })}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>การบริการ</h2>

        {employees.length === 0 && <p style={styles.muted}>ไม่มีข้อมูลพนักงาน</p>}

        {employees.map((employee, index) => {
          const key = employee.EId || employee.employeeId || index;
          const name =
            [employee.EFirstName, employee.ESurName].filter(Boolean).join(" ") ||
            employee.name ||
            "พนักงาน";

          return (
            <div key={key} style={styles.simpleCard}>
              <div style={styles.itemName}>{name}</div>
              <StarRating
                value={Number(employeeRatings[key] || 0)}
                onChange={(value) => setEmployeeRating(key, value)}
              />
            </div>
          );
        })}
      </section>

      {topics.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>ประสบการณ์การใช้บริการ</h2>

          {topics.map((topic, index) => {
            const key = topic.id || topic.topicId || topic.name || topic.title || index;
            const label = topic.name || topic.title || topic.label || String(topic);

            return (
              <div key={key} style={styles.simpleCard}>
                <div style={styles.itemName}>{label}</div>
                <StarRating
                  value={Number(topicRatings[key] || 0)}
                  onChange={(value) => setTopicRating(key, value)}
                />
              </div>
            );
          })}
        </section>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>ความคิดเห็นเพิ่มเติม</h2>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="พิมพ์ความคิดเห็น..."
          style={styles.textarea}
        />
      </section>

      <button type="button" onClick={handleSubmit} style={styles.submitButton}>
        ส่งแบบประเมิน
      </button>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    padding: "18px 14px 40px",
    boxSizing: "border-box",
    background: "#f7f1e8",
    overflowX: "hidden",
  },
  headerCard: {
    maxWidth: "620px",
    margin: "0 auto 18px",
    padding: "22px 16px",
    background: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    fontSize: "clamp(24px, 5vw, 36px)",
    lineHeight: 1.25,
    fontWeight: 800,
  },
  customer: {
    margin: "10px 0 0",
    fontSize: "18px",
  },
  section: {
    maxWidth: "620px",
    margin: "0 auto 18px",
  },
  sectionTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: 800,
  },
  itemCard: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  simpleCard: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  foodImage: {
    width: "92px",
    height: "76px",
    objectFit: "cover",
    borderRadius: "12px",
    flexShrink: 0,
  },
  noImage: {
    width: "92px",
    height: "76px",
    borderRadius: "12px",
    background: "#eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777777",
    fontSize: "14px",
    flexShrink: 0,
  },
  itemInfo: {
    minWidth: 0,
    flex: 1,
  },
  itemName: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "6px",
    wordBreak: "break-word",
  },
  stars: {
    display: "flex",
    flexDirection: "row",
    direction: "ltr",
    gap: "2px",
    alignItems: "center",
  },
  starButton: {
    border: "none",
    background: "transparent",
    padding: "2px",
    fontSize: "30px",
    lineHeight: 1,
    cursor: "pointer",
    userSelect: "none",
  },
  muted: {
    margin: 0,
    color: "#777777",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #cccccc",
    fontSize: "16px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitButton: {
    display: "block",
    width: "min(100%, 620px)",
    margin: "12px auto 0",
    padding: "16px 20px",
    border: "none",
    borderRadius: "16px",
    background: "#2f9e44",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(47,158,68,0.25)",
  },
  emptyCard: {
    maxWidth: "620px",
    margin: "80px auto",
    padding: "28px 20px",
    background: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
};
