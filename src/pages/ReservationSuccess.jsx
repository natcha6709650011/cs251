function ReservationSuccess({ customer, reservation, onHome, onHistory }) {
  if (!reservation) return null;

  return (
    <main className="p1-reserve-success-page">
      <section className="p1-reserve-success-card">
        <div className="p1-reserve-success-check">✓</div>

        <h1 className="p1-reserve-success-title">จองโต๊ะสำเร็จ</h1>

        <div className="p1-reserve-success-detail">
          <p>
            ผู้จอง : {customer?.MFirstName} {customer?.MSurName}
          </p>
          <p>โต๊ะ {reservation.tableNumber}</p>
          <p>วันที่จอง : {reservation.RDate}</p>
          <p>เวลาจอง : {reservation.RTime}</p>
          <p>จำนวนผู้เข้าใช้ทั้งหมด {reservation.PeopleCount} ท่าน</p>
        </div>

        <div className="p1-reserve-success-actions">
          <button
            type="button"
            className="p1-reserve-success-btn home"
            onClick={onHome}
          >
            กลับสู่หน้าหลัก
          </button>

          <button
            type="button"
            className="p1-reserve-success-btn history"
            onClick={onHistory}
          >
            ประวัติการจอง
          </button>
        </div>
      </section>
    </main>
  );
}

export default ReservationSuccess;