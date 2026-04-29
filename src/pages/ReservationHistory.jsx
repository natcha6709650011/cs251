import { useState } from "react";

function ReservationHistory({
  customer,
  reservations = [],
  onCheckIn,
  onCancel,
  onBack,
  isToday,
}) {
  const [successType, setSuccessType] = useState("");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const activeReservations = reservations.filter(
    (item) => item.status !== "cancelled"
  );

  function handleClickCheckIn(reservation) {
    setSelectedReservation(reservation);
    setSuccessType("checkin");
  }

  function handleClickCancel(reservation) {
    setSelectedReservation(reservation);
    setSuccessType("cancel");
  }

  function confirmGoOrderFood() {
    if (selectedReservation) {
      onCheckIn(selectedReservation);
    }
  }

  function confirmCancelAndBack() {
    if (selectedReservation) {
      onCancel(selectedReservation);
    }

    if (onBack) {
      onBack();
    }
  }

  return (
    <main className="p1-page">
      <section className="p1-history-page">
        <h1 className="p1-history-title">ประวัติการจอง</h1>

        {activeReservations.length === 0 ? (
          <div className="p1-history-empty">
            <p>ไม่พบประวัติการจอง</p>

            <button
              type="button"
              className="app-btn app-btn-blue"
              onClick={onBack}
            >
              กลับหน้าหลัก
            </button>
          </div>
        ) : (
          activeReservations.map((reservation) => {
            const canCheckIn = isToday ? isToday(reservation.RDate) : true;
            const canCancel = reservation.status === "reserved";

            return (
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
                    <strong>จำนวนผู้เข้าใช้ :</strong>{" "}
                    {reservation.PeopleCount}
                  </p>
                </div>

                <div className="p1-history-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-green p1-history-btn"
                    onClick={() => handleClickCheckIn(reservation)}
                    disabled={!canCheckIn || reservation.status === "checked_in"}
                  >
                    Check-in
                  </button>

                  <button
                    type="button"
                    className="app-btn app-btn-red p1-history-btn"
                    onClick={() => handleClickCancel(reservation)}
                    disabled={!canCancel}
                  >
                    ยกเลิกการจอง
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {successType === "checkin" && (
        <div className="p1-history-popup-backdrop">
          <div className="p1-history-popup-card">
            <div className="p1-history-popup-icon p1-history-popup-check">
              ✓
            </div>

            <h2 className="p1-history-popup-title">Checked in สำเร็จ</h2>

            <p className="p1-history-popup-text">
              โต๊ะ {selectedReservation?.tableNumber}
            </p>

            <button
              type="button"
              className="p1-history-popup-btn p1-history-popup-btn-red"
              onClick={confirmGoOrderFood}
            >
              กลับสู่หน้าสั่งอาหาร
            </button>
          </div>
        </div>
      )}

      {successType === "cancel" && (
        <div className="p1-history-popup-backdrop">
          <div className="p1-history-popup-card">
            <div className="p1-history-popup-icon p1-history-popup-cancel">
              ×
            </div>

            <h2 className="p1-history-popup-title">ยกเลิกการจองสำเร็จ</h2>

            <p className="p1-history-popup-text">
              โต๊ะ {selectedReservation?.tableNumber}
            </p>

            <button
              type="button"
              className="p1-history-popup-btn p1-history-popup-btn-blue"
              onClick={confirmCancelAndBack}
            >
              กลับสู่หน้าเลือกประเภทลูกค้า
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default ReservationHistory;