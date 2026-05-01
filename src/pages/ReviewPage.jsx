import React, { useState, useCallback } from "react";
import "../styles/person3-payment-review.css";

// 1. StarRating: ปรับให้เป็น Pure Component รับ props และแสดงผล
const StarRating = React.memo(({ value, onChange }) => (
  <div className="p3-stars" role="radiogroup" aria-label="Star Rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        type="button"
        key={star}
        className={`p3-star ${star <= value ? "active" : ""}`}
        onClick={() => onChange(star)}
        aria-checked={star <= value}
        role="radio"
      >
        ★
      </button>
    ))}
  </div>
));

// 2. RatingItem: Component ย่อยสำหรับแต่ละแถวที่ต้องการประเมิน
const RatingItem = ({ label, image, placeholder, value, onChange, className }) => (
  <div className={`p3-review-item ${className}`}>
    <p className="p3-item-label">{label}</p>
    <div className="p3-item-media">
      {image ? (
        <img src={image} alt={label} loading="lazy" />
      ) : (
        <div className="p3-img-placeholder">{placeholder || "รูป"}</div>
      )}
    </div>
    <StarRating value={value} onChange={onChange} />
  </div>
);

function ReviewPage({ reviewData, onSubmit }) {
  // 3. รวม State คะแนนไว้ที่เดียวเพื่อให้จัดการง่าย
  const [ratings, setRatings] = useState({
    menus: {},
    employees: {},
    topics: {},
  });
  const [comment, setComment] = useState("");

  // ฟังก์ชันกลางในการอัปเดตคะแนน
  const handleRate = useCallback((category, id, score) => {
    setRatings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [id]: score },
    }));
  }, []);

  if (!reviewData) {
    return (
      <main className="p3-review-phone">
        <div className="p3-review-mobile-frame">
          <section className="p3-review-container">
            <h1 className="p3-review-title">ไม่พบข้อมูลแบบประเมิน</h1>
          </section>
        </div>
      </main>
    );
  }

  const {
    customer,
    employees = [],
    employee,
    menus = [],
    experienceTopics = [],
  } = reviewData;

  const displayEmployees = employees.length > 0 ? employees : employee ? [employee] : [];

  const handleSubmit = () => {
    // 4. จัด Format ข้อมูลก่อนส่ง (Payload)
    const payload = {
      customerId: customer?.CId || "",
      ratings, // ส่งก้อน ratings ทั้งหมดไปจัดการต่อที่ Backend/API
      comment,
    };
    onSubmit(payload);
  };

  return (
    <main className="p3-review-phone">
      <div className="p3-review-mobile-frame">
        <header className="p3-review-topbar" />

        <section className="p3-review-container">
          <header className="p3-review-header">
            <h1 className="p3-review-title">
              แบบประเมินความพึงพอใจ<br />ในการใช้บริการ
            </h1>
            <div className="p3-review-logo">
              <img src="/image/logo.jpg" alt="CS Restaurant Logo" />
            </div>
            <p className="p3-review-customer">
              คุณ {customer?.MFirstName || "-"} {customer?.MSurName || ""}
            </p>
          </header>

          {/* ส่วนของอาหาร */}
          <section className="p3-review-section">
            <h2 className="p3-review-section-title">อาหาร</h2>
            {menus.length === 0 ? (
              <p className="p3-empty-msg">ไม่พบรายการอาหาร</p>
            ) : (
              menus.map((menu) => (
                <RatingItem
                  key={menu.menuId}
                  className="p3-review-menu"
                  label={menu.menuName}
                  image={menu.image}
                  value={ratings.menus[menu.menuId] || 0}
                  onChange={(score) => handleRate("menus", menu.menuId, score)}
                />
              ))
            )}
          </section>

          <div className="p3-review-divider" />

          {/* ส่วนของพนักงาน */}
          <section className="p3-review-section">
            <h2 className="p3-review-section-title">การบริการ</h2>
            {displayEmployees.length === 0 ? (
              <p className="p3-empty-msg">ไม่พบข้อมูลพนักงาน</p>
            ) : (
              displayEmployees.map((emp) => (
                <RatingItem
                  key={emp.EId}
                  className="p3-review-employee"
                  label={`${emp.EFirstName} ${emp.ESurName}`}
                  image={emp.avatar}
                  placeholder="👤"
                  value={ratings.employees[emp.EId] || 0}
                  onChange={(score) => handleRate("employees", emp.EId, score)}
                />
              ))
            )}
          </section>

          <div className="p3-review-divider" />

          {/* ส่วนประสบการณ์อื่นๆ */}
          <section className="p3-review-section">
            <h2 className="p3-review-section-title">ประสบการณ์อื่นๆ</h2>
            {experienceTopics.map((topic) => (
              <div className="p3-review-topic" key={topic.id}>
                <p>{topic.label}</p>
                <StarRating
                  value={ratings.topics[topic.id] || 0}
                  onChange={(score) => handleRate("topics", topic.id, score)}
                />
              </div>
            ))}
          </section>

          <textarea
            className="p3-review-comment"
            placeholder="ความคิดเห็นเพิ่มเติม..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <button
            type="button"
            className="p3-review-submit"
            onClick={handleSubmit}
          >
            ส่งแบบประเมิน
          </button>
        </section>
      </div>
    </main>
  );
}

export default ReviewPage;