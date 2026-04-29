function MemberLogin({
  memberTel,
  setMemberTel,
  memberMode,
  onSubmit,
  onRegister,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <main className="p1-page">
      <section className="p1-member-login-card">
        <h1 className="p1-member-login-title">กรุณากรอกเบอร์โทรสมาชิก</h1>

        <form onSubmit={handleSubmit} className="p1-member-login-form">
          <input
            className="p1-member-login-input"
            type="tel"
            value={memberTel}
            onChange={(event) => setMemberTel(event.target.value)}
            placeholder="เบอร์โทรศัพท์"
            maxLength="10"
            autoFocus
          />

          <button
            type="submit"
            className="p1-member-login-btn"
          >
            ยืนยัน
          </button>
        </form>

        <button
          type="button"
          className="p1-member-register-btn"
          onClick={onRegister}
        >
          สมัครสมาชิก
        </button>

        <p className="p1-member-mode-text">
          {memberMode === "reserve"
            ? "โหมดลูกค้าจองโต๊ะ"
            : "โหมดลูกค้าสมาชิก"}
        </p>
      </section>
    </main>
  );
}

export default MemberLogin;