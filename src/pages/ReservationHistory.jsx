function ReservationHistory({
  customer,
  reservations = [],
  onCheckIn,
  onCancel,
  onBack,
  isToday,
  isFutureDate,
}) {
  const activeReservations = reservations.filter(
    (item) => item.status !== "cancelled"
  );

  return (
    <main className="p1-page">
      <section className="p1-history-page">
        <h1 className="p1-history-title">ประวัติการจอง</h1>

        {activeReservations.length === 0 ? (
          <div className="p1-history-empty">
            <p>ไม่พบประวัติการจอง</p>
            <button type="button" className="app-btn app-btn-blue" onClick={onBack}>
              กลับหน้าหลัก
            </button>
          </div>
        ) : (
          activeReservations.map((reservation) => {
            const canCheckIn = isToday
              ? isToday(reservation.RDate)
              : true;

            const canCancel = isFutureDate
              ? isFutureDate(reservation.RDate)
              : true;

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
                  <p>
                    <strong>สถานะ :</strong>{" "}
                    {reservation.status === "checked_in"
                      ? "Check-in แล้ว"
                      : "จองแล้ว"}
                  </p>
                </div>

                <div className="p1-history-actions">
                  <button
                    type="button"
                    className="app-btn app-btn-green p1-history-btn"
                    onClick={() => onCheckIn(reservation)}
                    disabled={!canCheckIn || reservation.status === "checked_in"}
                  >
                    Check-in
                  </button>

                  <button
                    type="button"
                    className="app-btn app-btn-red p1-history-btn"
                    onClick={() => onCancel(reservation)}
                    disabled={!canCancel || reservation.status === "checked_in"}
                  >
                    ยกเลิกการจอง
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}

export default ReservationHistory;