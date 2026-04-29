import TableGrid from "../components/TableGrid";

function ReservationPage({
  customer,
  tables = [],
  reservationDate,
  setReservationDate,
  reservationTime,
  setReservationTime,
  peopleCount,
  setPeopleCount,
  onCreateReservation,
}) {
  const emptyTables = tables.filter((table) => table.Status === "ว่าง");

  function handleTableClick(table) {
    onCreateReservation({
      table,
      date: reservationDate,
      time: reservationTime,
      count: peopleCount,
    });
  }

  return (
    <main className="p1-page">
      <section className="p1-reservation-control">
        <h1 className="p1-reservation-title">เลือกวัน เวลา และโต๊ะสำหรับจอง</h1>

        {customer && (
          <p className="p1-reservation-customer">
            ลูกค้า: {customer.MFirstName} {customer.MSurName}
          </p>
        )}

        <div className="p1-reservation-form">
          <label className="p1-reservation-label">
            วันที่จอง
            <input
              className="p1-reservation-input"
              type="date"
              value={reservationDate}
              onChange={(event) => setReservationDate(event.target.value)}
            />
          </label>

          <label className="p1-reservation-label">
            เวลาจอง
            <input
              className="p1-reservation-input"
              type="time"
              value={reservationTime}
              onChange={(event) => setReservationTime(event.target.value)}
            />
          </label>

          <label className="p1-reservation-label">
            จำนวนผู้เข้าใช้
            <div className="p1-people-control">
              <button
                type="button"
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              >
                -
              </button>

              <span>{peopleCount}</span>

              <button
                type="button"
                onClick={() => setPeopleCount(peopleCount + 1)}
              >
                +
              </button>
            </div>
          </label>
        </div>
      </section>

      <section className="p1-section">
        <h2 className="p1-page-title">เลือกโต๊ะที่ต้องการจอง</h2>

        <TableGrid tables={emptyTables} onTableClick={handleTableClick} />
      </section>
    </main>
  );
}

export default ReservationPage;