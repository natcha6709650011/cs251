import TableGrid from "../components/TableGrid";

const RESERVATION_DURATION_MINUTES = 90;

function timeToMinutes(time) {
  if (!time) return 0;

  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function isTimeOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function reservationIsActive(reservation) {
  return (
    reservation.status === "reserved" || reservation.status === "checked_in"
  );
}

function reservationOverlapsSelectedTime(reservation, date, startMinutes, endMinutes) {
  if (!reservationIsActive(reservation)) return false;
  if (reservation.RDate !== date) return false;

  const oldStart = timeToMinutes(reservation.RTime);
  const oldDuration =
    reservation.durationMinutes || RESERVATION_DURATION_MINUTES;
  const oldEnd = oldStart + oldDuration;

  return isTimeOverlap(startMinutes, endMinutes, oldStart, oldEnd);
}

function ReservationPage({
  customer,
  tables = [],
  reservations = [],
  reservationDate,
  setReservationDate,
  reservationTime,
  setReservationTime,
  peopleCount,
  setPeopleCount,
  onCreateReservation,
}) {
  const selectedDate = reservationDate || "";
  const selectedTime = reservationTime || "";

  const selectedStart = timeToMinutes(selectedTime);
  const selectedEnd = selectedStart + RESERVATION_DURATION_MINUTES;

  const reservedTableNumbers = reservations
    .filter((reservation) => {
      if (!selectedDate || !selectedTime) return false;

      return reservationOverlapsSelectedTime(
        reservation,
        selectedDate,
        selectedStart,
        selectedEnd
      );
    })
    .map((reservation) => reservation.tableNumber);

  /*
    หน้าจอง:
    - ไม่สนใจ Status จากการบริการปกติ
    - ไม่โชว์รหัสพนักงาน
    - Full เฉพาะโต๊ะที่มี reservation ทับช่วงวัน+เวลาที่เลือก
  */
  const displayTables = tables.map((table) => {
    const isReservedAtSelectedTime = reservedTableNumbers.includes(
      table.TNumber
    );

    return {
      ...table,
      Status: isReservedAtSelectedTime ? "ไม่ว่าง" : "ว่าง",
      reservedByTime: isReservedAtSelectedTime,
      employeeId: "",
      employeeIds: [],
    };
  });

  function handleTableClick(table) {
    if (!selectedDate || !selectedTime || !peopleCount) {
      alert("กรุณาเลือกวันที่ เวลา และจำนวนผู้เข้าใช้ก่อน");
      return;
    }

    if (table.reservedByTime) {
      alert("โต๊ะนี้ถูกจองแล้วในช่วงเวลาที่เลือก");
      return;
    }

    onCreateReservation({
      table,
      date: selectedDate,
      time: selectedTime,
      count: peopleCount,
    });
  }

  return (
    <main className="p1-page">
      <section className="p1-reservation-page">
        <h1 className="p1-reservation-title">
          เลือกวัน เวลา และโต๊ะสำหรับจอง
        </h1>

        <p className="p1-reservation-customer">
          ลูกค้า: {customer?.MFirstName || "-"} {customer?.MSurName || ""}
        </p>

        <div className="p1-reservation-form">
          <div className="p1-reservation-field">
            <label htmlFor="reservation-date">วันที่จอง</label>
            <input
              id="reservation-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setReservationDate(event.target.value)}
            />
          </div>

          <div className="p1-reservation-field">
            <label htmlFor="reservation-time">เวลาจอง</label>
            <input
              id="reservation-time"
              type="time"
              value={selectedTime}
              onChange={(event) => setReservationTime(event.target.value)}
            />
          </div>

          <div className="p1-reservation-field">
            <label htmlFor="people-count">จำนวนผู้เข้าใช้</label>
 <input
  type="number"
  min="1"
  value={peopleCount ?? ""}
  placeholder="กรอกจำนวนคน"
  onFocus={() => {
    if (peopleCount === 1 || peopleCount === "1") {
      setPeopleCount("");
    }
  }}
  onChange={(e) => {
    setPeopleCount(e.target.value);
  }}
  style={{
    width: "100%",
    height: "60px",
    borderRadius: "12px",
    border: "1px solid #999",
    padding: "0 16px",
    fontSize: "22px",
    boxSizing: "border-box",
  }}
/>
          </div>
        </div>

        <h2 className="p1-reservation-table-title">
          เลือกโต๊ะที่ต้องการจอง
        </h2>

        <TableGrid
          tables={displayTables}
          onTableClick={handleTableClick}
          mode="reservation"
        />
      </section>
    </main>
  );
}

export default ReservationPage;
