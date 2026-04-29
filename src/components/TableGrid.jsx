function TableGrid({ tables = [], onTableClick }) {
  const groups = ["S", "M", "L"];

  return (
    <div className="p1-table-grid">
      {groups.map((group) => {
        const groupTables = tables.filter((table) => table.T_Type === group);

        return (
          <div className="p1-table-row" key={group}>
            <div className="p1-table-size-box">{group}</div>

            <div className="p1-table-list">
              {groupTables.map((table) => {
                const isFull = table.Status === "ไม่ว่าง";

                return (
                  <button
                    type="button"
                    key={table.TNumber}
                    className={`p1-table-card ${
                      isFull ? "p1-table-full" : "p1-table-empty"
                    }`}
                    onClick={() => onTableClick(table)}
                  >
                    <span className="p1-table-number">{table.TNumber}</span>
                    <span className="p1-table-status">
                      {isFull ? "Full" : "Empty"}
                    </span>

                    {isFull && table.employeeId && (
                      <span className="p1-table-employee">
                        {table.employeeId}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TableGrid;