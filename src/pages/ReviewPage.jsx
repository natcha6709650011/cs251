import { useState } from "react";
import "../styles/person3-payment-review.css";

function StarRating({ value, onChange }) {
  return (
    <div className="p3-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={star <= value ? "p3-star active" : "p3-star"}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewPage({ reviewData, onSubmit }) {
  const [menuRatings, setMenuRatings] = useState({});
  const [employeeRatings, setEmployeeRatings] = useState({});
  const [topicRatings, setTopicRatings] = useState({});
  const [comment, setComment] = useState("");

  if (!reviewData) {
    return (
      <main className="p3-review-phone">
        <div className="p3-review-mobile-frame">
          <section className="p3-review-topbar"></section>

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

  const displayEmployees =
    employees.length > 0 ? employees : employee ? [employee] : [];

  function updateMenuRating(menuId, score) {
    setMenuRatings((prev) => ({
      ...prev,
      [menuId]: score,
    }));
  }

  function updateEmployeeRating(employeeId, score) {
    setEmployeeRatings((prev) => ({
      ...prev,
      [employeeId]: score,
    }));
  }

  function updateTopicRating(topicId, score) {
    setTopicRatings((prev) => ({
      ...prev,
      [topicId]: score,
    }));
  }

  function handleSubmit() {
    const payload = {
      customerId: customer?.CId || "",
      employeeRatings,
      menuRatings,
      topicRatings,
      comment,
    };

    onSubmit(payload);
  }

  return (
    <main className="p3-review-phone">
      <div className="p3-review-mobile-frame">
        <section className="p3-review-topbar"></section>

        <section className="p3-review-container">
          <h1 className="p3-review-title">
            แบบประเมินความพึงพอใจ
            <br />
            ในการใช้บริการ
          </h1>

          <div className="p3-review-logo">
            <img src="/image/logo.jpg" alt="CS Restaurant Logo" />
          </div>

          <p className="p3-review-customer">
            คุณ{customer?.MFirstName || "-"} {customer?.MSurName || ""}
          </p>

          <h2 className="p3-review-section-title">อาหาร</h2>

          {menus.length === 0 ? (
            <div className="p3-review-menu">
              <p>ไม่พบรายการอาหาร</p>
            </div>
          ) : (
            menus.map((menu, index) => (
              <div className="p3-review-menu" key={`${menu.menuId}-${index}`}>
                <p>{menu.menuName}</p>

                <div className="p3-review-menu-img">
                  {menu.image ? (
                    <img src={menu.image} alt={menu.menuName} />
                  ) : (
                    <div className="p3-review-img-placeholder">รูป</div>
                  )}
                </div>

                <StarRating
                  value={menuRatings[menu.menuId] || 0}
                  onChange={(score) => updateMenuRating(menu.menuId, score)}
                />
              </div>
            ))
          )}

          <div className="p3-review-divider"></div>

          <h2 className="p3-review-section-title">การบริการ</h2>

          {displayEmployees.length === 0 ? (
            <div className="p3-review-employee">
              <p>ไม่พบข้อมูลพนักงาน</p>
            </div>
          ) : (
            displayEmployees.map((emp) => (
              <div className="p3-review-employee" key={emp.EId}>
                <p>
                  {emp.EFirstName} {emp.ESurName}
                </p>

                <div className="p3-review-employee-img">
                  {emp?.avatar ? (
                    <img src={emp.avatar} alt="employee" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <StarRating
                  value={employeeRatings[emp.EId] || 0}
                  onChange={(score) => updateEmployeeRating(emp.EId, score)}
                />
              </div>
            ))
          )}

          <div className="p3-review-divider"></div>

          <h2 className="p3-review-section-title">ประสบการณ์การใช้บริการ</h2>

          {experienceTopics.map((topic) => (
            <div className="p3-review-topic" key={topic.id}>
              <p>{topic.label}</p>

              <StarRating
                value={topicRatings[topic.id] || 0}
                onChange={(score) => updateTopicRating(topic.id, score)}
              />
            </div>
          ))}

          <textarea
            className="p3-review-comment"
            placeholder="ความคิดเห็นเพิ่มเติม"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
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