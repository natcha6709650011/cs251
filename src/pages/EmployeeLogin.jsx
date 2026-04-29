function EmployeeLogin({ employeeId, setEmployeeId, onLogin }) {
  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
  }

  return (
    <main className="p1-login-page">
      <div className="p1-login-topbar">
        <div className="p1-login-user-icon">👤</div>
      </div>

      <form className="p1-login-card" onSubmit={handleSubmit}>
        <h1 className="p1-login-title">กรุณากรอกรหัสพนักงาน</h1>

        <input
          className="p1-login-input"
          type="text"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          placeholder="รหัสพนักงาน"
          autoFocus
        />

        <button type="submit" className="app-btn app-btn-green p1-login-btn">
          ยืนยัน
        </button>
      </form>
    </main>
  );
}

export default EmployeeLogin;