function MemberRegister({ registerForm, setRegisterForm, onSubmit, onBack }) {
  function updateField(field, value) {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <main className="p1-page">
      <section className="p1-register-page">
        <form className="p1-register-form" onSubmit={handleSubmit}>
          <label className="p1-register-label">
            ชื่อ**
            <input
              className="p1-register-input"
              type="text"
              value={registerForm.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
            />
          </label>

          <label className="p1-register-label">
            นามสกุล**
            <input
              className="p1-register-input"
              type="text"
              value={registerForm.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
            />
          </label>

          <label className="p1-register-label">
            เบอร์โทรศัพท์**
            <input
              className="p1-register-input"
              type="tel"
              maxLength="10"
              value={registerForm.tel}
              onChange={(event) => updateField("tel", event.target.value)}
            />
          </label>

          <label className="p1-register-label">
            อีเมล์**
            <input
              className="p1-register-input"
              type="email"
              value={registerForm.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>

          <div className="p1-register-actions">
            <button type="button" className="app-btn app-btn-red" onClick={onBack}>
              ย้อนกลับ
            </button>

            <button type="submit" className="app-btn app-btn-yellow p1-register-submit">
              สมัครสมาชิก
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default MemberRegister;