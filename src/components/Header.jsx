function Header({
  employee,
  selectedTable,
  cartCount = 0,
  onEmployeeClick,
  onSelectTable,
  onCartClick,
  onBillClick,
}) {
  return (
    <header className="p1-header">
      <div className="p1-header-left">
        <button
          type="button"
          className="p1-header-avatar"
          onClick={onEmployeeClick}
          title="ข้อมูลพนักงาน"
        >
          {employee?.avatar ? (
            <img src={employee.avatar} alt="employee" />
          ) : (
            <span>👤</span>
          )}
        </button>

        <button
          type="button"
          className="p1-header-pill"
          onClick={onEmployeeClick}
        >
          {employee?.EId || "-"}
        </button>

        {selectedTable ? (
          <button
            type="button"
            className="p1-header-pill"
            onClick={onSelectTable}
          >
            {selectedTable.TNumber}
          </button>
        ) : (
          <button
            type="button"
            className="p1-header-pill"
            onClick={onSelectTable}
          >
            เลือกโต๊ะ
          </button>
        )}
      </div>

      <div className="p1-header-right">
        <button
          type="button"
          className="p1-header-cart-icon"
          onClick={onCartClick}
          title="ตะกร้า"
        >
          🛒
          {cartCount > 0 && (
            <span className="p1-header-cart-badge">{cartCount}</span>
          )}
        </button>

        <button
          type="button"
          className="p1-header-pill p1-header-cart-btn"
          onClick={onCartClick}
        >
          ตะกร้าของคุณ
          {cartCount > 0 && (
            <span className="p1-header-cart-number">{cartCount}</span>
          )}
        </button>

        <button
          type="button"
          className="p1-header-pill"
          onClick={onBillClick}
        >
          บิล
        </button>
      </div>
    </header>
  );
}

export default Header;