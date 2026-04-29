import { useState } from "react";

function ReservationHistory({
  customer,
  reservations = [],
  onCheckIn,
  onCancel,
  onBack,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const filteredReservations = reservations.filter((reservation) => {
    if (!selectedDate) return true;
    return reservation.RDate === selectedDate;
  });

  const activeReservations = filteredReservations.filter(
    (reservation) => reservation.status !== "cancelled"
  );

  function openConfirm(type, reservation) {
    setConfirmAction(type);
    setSelectedReservation(reservation);
  }

  function closeConfirm() {
    setConfirmAction(null);
    setSelectedReservation(null);
  }

  function confirmCheckIn() {
    if (selectedReservation) {
      onCheckIn(selectedReservation);
    }
    closeConfirm();
  }

  function confirmCancel() {
    if (selectedReservation) {
      onCancel(selectedReservation);
    }
    closeConfirm();
  }

  return (
    <main className="p1-page">
      <section className="p1-history-page">
        <h1 className="p1-history-title">ประวัติการจอง</h1>

        <p className="p1-history-customer">
          ลูกค้า: {customer?.MFirstName || "-"} {customer?.MSurName || ""}
        </p>

        <div className="p1-history-filter">
          <label htmlFor="history-date">เลือกวันที่</label>

          <input
            id="history-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />

          <button
            type="button"
            className="p1-history-clear-btn"
            onClick={() => setSelectedDate("")}
          >
            แสดงทั้งหมด
          </button>
        </div>

        {activeReservations.length === 0 ? (
          <div className="p1-history-empty">
            ไม่พบประวัติการจองในวันที่เลือก
          </div>
        ) : (
          activeReservations.map((reservation) => (
            <div className="p1-history-card" key={reservation.RId}>
              <div className="p1-history-name">
                คุณ {customer?.MFirstName} {customer?.MSurName}
              </div>

              <div className="p1-history-detail">
                <p>
                  <strong>โต๊ะ :</strong> {reservation.tableNumber}
                </p>
                <p>
                  <strong>วันที่จอง :</strong> {reservation.RDate}
                </p>
                <p>
                  <strong>เวลาที่จอง :</strong> {reservation.RTime}
                </p>
                <p>
                  <strong>จำนวนผู้เข้าใช้ :</strong> {reservation.PeopleCount}
                </p>
                <p>
                  <strong>สถานะ :</strong>{" "}
                  {reservation.status === "reserved"
                    ? "จองแล้ว"
                    : reservation.status === "checked_in"
                    ? "Check-in แล้ว"
                    : reservation.status}
                </p>
              </div>

              <div className="p1-history-actions">
                <button
                  type="button"
                  className="p1-history-btn p1-btn-green"
                  onClick={() => openConfirm("checkin", reservation)}
                  disabled={reservation.status === "checked_in"}
                >
                  Check-in
                </button>

                <button
                  type="button"
                  className="p1-history-btn p1-btn-red"
                  onClick={() => openConfirm("cancel", reservation)}
                  disabled={reservation.status === "checked_in"}
                >
                  ยกเลิกการจอง
                </button>
              </div>
            </div>
          ))
        )}

        <div className="p1-history-bottom">
          <button type="button" className="p1-btn-gray" onClick={onBack}>
            กลับสู่หน้าเลือกประเภทลูกค้า
          </button>
        </div>
      </section>

      {confirmAction && selectedReservation && (
        <div className="p1-history-popup-backdrop">
          <div className="p1-history-popup-card">
            <div
              className={`p1-history-popup-icon ${
                confirmAction === "checkin"
                  ? "p1-history-popup-check"
                  : "p1-history-popup-cancel"
              }`}
            >
              {confirmAction === "checkin" ? "✓" : "×"}
            </div>

            <h2 className="p1-history-popup-title">
              {confirmAction === "checkin"
                ? "ยืนยัน Check-in?"
                : "ยืนยันยกเลิกการจอง?"}
            </h2>

            <p className="p1-history-popup-text">
              โต๊ะ {selectedReservation.tableNumber} วันที่ {selectedReservation.RDate} เวลา {selectedReservation.RTime}
            </p>

            <div className="p1-history-popup-actions">
              <button
                type="button"
                className={
                  confirmAction === "checkin"
                    ? "p1-history-popup-btn p1-history-popup-btn-green"
                    : "p1-history-popup-btn p1-history-popup-btn-red"
                }
                onClick={confirmAction === "checkin" ? confirmCheckIn : confirmCancel}
              >
                ยืนยัน
              </button>

              <button
                type="button"
                className="p1-history-popup-btn p1-history-popup-btn-gray"
                onClick={closeConfirm}
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ReservationHistory;
