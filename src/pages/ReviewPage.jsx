import React, { useMemo, useState } from "react";

const LOGO_CANDIDATES = [
  "/image/logo.png",
  "/image/logo.jpg",
  "/image/Logo.png",
  "/image/CSrestaurant.png",
  "/image/CS Restaurant.png",
  "/logo.png",
  "/logo.jpg",
];

function ImageWithFallback({ candidates = [], alt, style, placeholderStyle }) {
  const list = candidates.filter(Boolean);
  const [index, setIndex] = useState(0);
  const src = list[index];

  if (!src) {
    return (
      <div style={placeholderStyle || styles.placeholderImage}>
        ไม่มีรูป
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => {
        if (index < list.length - 1) {
          setIndex(index + 1);
        } else {
          setIndex(list.length);
        }
      }}
    />
  );
}

function StarRating({ value = 0, onChange, center = false }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        justifyContent: center ? "center" : "flex-start",
        flexWrap: "nowrap",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            fontSize: "50px",
            lineHeight: 1,
            cursor: "pointer",
            color: star <= value ? "#f6c21a" : "#e0e0e0",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewPage({ reviewData, onSubmit }) {
  const [foodRatings, setFoodRatings] = useState({});
  const [employeeRatings, setEmployeeRatings] = useState({});
  const [experienceRatings, setExperienceRatings] = useState({});
  const [comment, setComment] = useState("");

  const customerName = useMemo(() => {
    const c = reviewData?.customer;
    if (!c) return "";
    return `${c.MFirstName || c.firstName || ""} ${c.MSurName || c.lastName || ""}`.trim();
  }, [reviewData]);

  if (!reviewData) {
    return (
      <div style={styles.page}>
        <div style={styles.notFound}>ไม่พบข้อมูลแบบประเมิน</div>
      </div>
    );
  }

  const menus = reviewData.menus || [];
  const employees = reviewData.employees || [];
  const topics =
    reviewData.experienceTopics || [
      { id: "cleanliness", name: "ความสะอาด" },
      { id: "speed", name: "ความรวดเร็ว" },
      { id: "overall", name: "ความพึงพอใจโดยรวม" },
    ];

  const avg = (obj) => {
    const values = Object.values(obj).map(Number).filter((v) => v > 0);
    if (!values.length) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const handleSubmit = () => {
    const payload = {
      foodRatings,
      employeeRatings,
      experienceRatings,
      foodRating: avg(foodRatings),
      orderRating: avg(foodRatings),
      employeeRating: avg(employeeRatings),
      serviceRating: avg(employeeRatings),
      rating: avg({
        ...foodRatings,
        ...employeeRatings,
        ...experienceRatings,
      }),
      comment,
      foodComment: comment,
      orderComment: comment,
      serviceComment: comment,
      employeeComment: comment,
    };

    if (onSubmit) onSubmit(payload);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            แบบประเมินความพึงพอใจ
            <br />
            ในการใช้บริการ
          </h1>

          <ImageWithFallback
            candidates={LOGO_CANDIDATES}
            alt="CS Restaurant"
            style={styles.logo}
            placeholderStyle={{ display: "none" }}
          />

          <div style={styles.customer}>คุณ {customerName || "-"}</div>
        </div>

        <h2 style={styles.sectionTitle}>อาหาร</h2>

        {menus.map((menu, index) => {
          const key = `${menu.menuId || "menu"}-${index}`;
          const candidates = [
            menu.image,
            ...(menu.imageCandidates || []),
          ];

          return (
            <div key={key} style={styles.foodCard}>
              <div style={styles.foodName}>
                {menu.menuName || menu.name || "ไม่ระบุชื่อเมนู"}
              </div>

              <ImageWithFallback
                candidates={candidates}
                alt={menu.menuName || menu.name}
                style={styles.foodImage}
                placeholderStyle={styles.placeholderImage}
              />

              <StarRating
                center
                value={foodRatings[key] || 0}
                onChange={(value) =>
                  setFoodRatings((prev) => ({
                    ...prev,
                    [key]: value,
                  }))
                }
              />
            </div>
          );
        })}

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>การบริการ</h2>

        {employees.map((emp, index) => {
          const empId = emp.EId || `emp-${index}`;
          const empName =
            `${emp.EFirstName || ""} ${emp.ESurName || ""}`.trim() || empId;

          return (
            <div key={empId} style={styles.serviceCard}>
              <div style={styles.employeeName}>{empName}</div>
              <StarRating
                center
                value={employeeRatings[empId] || 0}
                onChange={(value) =>
                  setEmployeeRatings((prev) => ({
                    ...prev,
                    [empId]: value,
                  }))
                }
              />
            </div>
          );
        })}

        <hr style={styles.divider} />

        <h2 style={styles.sectionTitle}>ประสบการณ์การใช้บริการ</h2>

        {topics.map((topic) => (
          <div key={topic.id} style={styles.topicCard}>
            <div style={styles.topicName}>{topic.name}</div>
            <StarRating
              value={experienceRatings[topic.id] || 0}
              onChange={(value) =>
                setExperienceRatings((prev) => ({
                  ...prev,
                  [topic.id]: value,
                }))
              }
            />
          </div>
        ))}

        <h2 style={styles.sectionTitle}>ความคิดเห็นเพิ่มเติม</h2>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="พิมพ์ความคิดเห็น..."
          style={styles.textarea}
        />

        <button type="button" onClick={handleSubmit} style={styles.submitButton}>
          ส่งแบบประเมิน
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f7f1e8",
    minHeight: "100vh",
    padding: "72px 20px 60px",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "34px",
  },
  title: {
    margin: "0 0 28px",
    fontSize: "32px",
    lineHeight: 1.35,
    fontWeight: 800,
    color: "#111",
  },
  logo: {
    width: "180px",
    height: "180px",
    objectFit: "contain",
    borderRadius: "24px",
    display: "block",
    margin: "0 auto 28px",
  },
  customer: {
    fontSize: "24px",
    fontWeight: 500,
    color: "#111",
  },
  sectionTitle: {
    fontSize: "30px",
    fontWeight: 800,
    margin: "34px 0 18px",
    color: "#111",
  },
  foodCard: {
    background: "#fff",
    border: "1px solid #d8d8d8",
    borderRadius: "26px",
    padding: "26px 20px",
    marginBottom: "22px",
    textAlign: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
  },
  foodName: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "#111",
  },
  foodImage: {
    width: "190px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "18px",
    display: "block",
    margin: "0 auto 18px",
  },
  placeholderImage: {
    width: "190px",
    height: "150px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 18px",
    background: "#e9e9e9",
    color: "#777",
    fontSize: "20px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #d4cbbf",
    margin: "30px 0",
  },
  serviceCard: {
    background: "#fff",
    border: "1px solid #d8d8d8",
    borderRadius: "22px",
    padding: "24px 20px",
    marginBottom: "22px",
    textAlign: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
  },
  employeeName: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "18px",
    color: "#111",
  },
  topicCard: {
    background: "#fff",
    border: "1px solid #ececec",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
  },
  topicName: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "12px",
    color: "#111",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    borderRadius: "18px",
    border: "2px solid #d8d8d8",
    padding: "18px",
    fontSize: "20px",
    outline: "none",
    resize: "vertical",
    background: "#fff",
    boxSizing: "border-box",
  },
  submitButton: {
    width: "100%",
    marginTop: "24px",
    background: "#2fab4f",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    padding: "18px",
    fontSize: "24px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(76,175,80,0.25)",
  },
  notFound: {
    background: "#fff",
    borderRadius: "24px",
    padding: "40px 20px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: 800,
    margin: "120px auto 0",
    maxWidth: "700px",
  },
};
