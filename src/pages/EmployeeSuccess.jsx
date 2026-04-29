function EmployeeSuccess({ employee, onNext, onLogout }) {
  if (!employee) return null;

  return (
    <main className="p1-login-page">
      <div className="p1-mini-topbar">
        <div className="p1-mini-avatar">
          {employee.avatar ? <img src={employee.avatar} alt="employee" /> : "👤"}
        </div>

        <div className="p1-mini-id">{employee.EId}</div>
      </div>

      <section className="p1-success-card">
        <div className="p1-success-icon">✓</div>

        <h1 className="p1-success-title">เข้าสู่ระบบสำเร็จ!</h1>

        <p className="p1-success-text">
          สวัสดีคุณ {employee.EFirstName} {employee.ESurName} รหัสพนักงาน{" "}
          {employee.EId}
        </p>

        <button type="button" className="app-btn app-btn-green p1-success-btn" onClick={onNext}>
          เสร็จสิ้น
        </button>

        <button type="button" className="app-btn app-btn-red p1-success-btn" onClick={onLogout}>
          ออกจากระบบ
        </button>
      </section>
    </main>
  );
}

export default EmployeeSuccess;