function EmployeeModal({ employee, onClose, onLogout }) {
  if (!employee) return null;

  return (
    <div className="p1-modal-backdrop">
      <div className="p1-employee-modal">
        <button type="button" className="p1-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="p1-modal-avatar">
          {employee?.avatar ? (
            <img src={employee.avatar} alt="employee" />
          ) : (
            <span>👤</span>
          )}
        </div>

        <h2 className="p1-modal-title">
          {employee.EFirstName} {employee.ESurName}
        </h2>

        <p className="p1-modal-text">รหัสพนักงาน : {employee.EId}</p>
        <p className="p1-modal-text">ตำแหน่ง : {employee.ERole}</p>
        <p className="p1-modal-text">สถานะ : {employee.EStatus}</p>

        <div className="p1-modal-actions">
          <button
            type="button"
            className="app-btn app-btn-green"
            onClick={onClose}
          >
            ย้อนกลับ
          </button>

          <button
            type="button"
            className="app-btn app-btn-red"
            onClick={onLogout}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeModal;