function TableGrid({ tables = [], onTableClick, mode = "service" }) {
  const getTablesByType = (type) => {
    return tables.filter((table) => table.TNumber?.startsWith(type));
  };

  const renderRow = (type) => {
    const rowTables = getTablesByType(type);

    return (
      <div className="p1-table-row" key={type}>
        <div className="p1-table-size-box">{type}</div>

        <div className="p1-table-list">
          {rowTables.map((table) => {
            const isReservationPage = mode === "reservation";
            const isReservedAtSelectedTime = table.reservedByTime === true;
            const isReservedForWalkIn = table.reservedForWalkIn === true;

            /*
              หน้า reservation:
              - Full เฉพาะโต๊ะที่ถูกจองในวัน+เวลานั้น
              - Full แล้วกดไม่ได้

              หน้า service:
              - Full จากการใช้งานปกติกดได้ เพื่อสั่งเพิ่ม
              - Reserved จาก reservation ที่ชนเวลาปัจจุบันกดไม่ได้
            */
            const isFull = isReservationPage
              ? isReservedAtSelectedTime
              : table.Status === "ไม่ว่าง";

            const disabled =
              (isReservationPage && isReservedAtSelectedTime) ||
              (!isReservationPage && isReservedForWalkIn);

            const statusText = isReservedForWalkIn
              ? "Reserved"
              : isFull
              ? "Full"
              : "Empty";

            return (
              <button
                key={table.TNumber}
                type="button"
                className={`p1-table-card ${
                  isFull ? "p1-table-full" : "p1-table-empty"
                } ${disabled ? "p1-table-disabled" : ""}`}
                onClick={() => onTableClick(table)}
                disabled={disabled}
              >
                <div className="p1-table-number">{table.TNumber}</div>

                <div className="p1-table-status">{statusText}</div>

                {!isReservationPage && isReservedForWalkIn && (
                  <div className="p1-table-employee">
                    จอง {table.reservedTime}
                  </div>
                )}

                {!isReservationPage &&
                  !isReservedForWalkIn &&
                  table.employeeIds?.length > 0 && (
                    <div className="p1-table-employee">
                      {table.employeeIds.join(", ")}
                    </div>
                  )}

                {!isReservationPage &&
                  !isReservedForWalkIn &&
                  !table.employeeIds?.length &&
                  table.employeeId && (
                    <div className="p1-table-employee">
                      {table.employeeId}
                    </div>
                  )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p1-table-grid">
      {renderRow("S")}
      {renderRow("M")}
      {renderRow("L")}
    </div>
  );
}

export default TableGrid;
