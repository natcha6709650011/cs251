function EmployeeConfirm({ employee, onConfirm, onLogout }) {
  if (!employee) return null;

  return (
    <main className="p1-login-page">
      <div className="p1-login-topbar">
        <div className="p1-login-user-icon">👤</div>
      </div>

      <section className="p1-employee-card">
        <div className="p1-employee-avatar">
          {employee.avatar ? <img src={employee.avatar} alt="employee" /> : "👤"}
        </div>

        <h1 className="p1-employee-name">
          {employee.EFirstName} {employee.ESurName}
        </h1>

        <p className="p1-employee-text">รหัสพนักงาน : {employee.EId}</p>
        <p className="p1-employee-text">ตำแหน่ง : {employee.ERole}</p>

        <div className="p1-employee-actions">
          <button type="button" className="app-btn app-btn-green" onClick={onConfirm}>
            ย้อนกลับ
          </button>

          <button type="button" className="app-btn app-btn-red" onClick={onLogout}>
            ออกจากระบบ
          </button>
        </div>
      </section>
    </main>
  );
}

export default EmployeeConfirm;