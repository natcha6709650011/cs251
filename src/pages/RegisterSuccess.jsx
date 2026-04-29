function RegisterSuccess({ customer, memberMode, onNext }) {
  if (!customer) return null;

  return (
    <main className="p1-page">
      <section className="p1-register-success-card">
        <div className="p1-success-icon p1-register-success-icon">✓</div>

        <h1 className="p1-register-success-title">สมัครสมาชิกสำเร็จ!</h1>

        <p className="p1-register-success-text">
          สวัสดีคุณ{customer.MFirstName} รหัสสมาชิก{customer.CId}
        </p>

        <button
          type="button"
          className="app-btn app-btn-yellow p1-register-success-btn"
          onClick={onNext}
        >
          {memberMode === "reserve" ? "จองโต๊ะ" : "สั่งอาหาร"}
        </button>

        <button
          type="button"
          className="app-btn app-btn-green p1-register-success-btn"
          onClick={onNext}
        >
          เสร็จสิ้น
        </button>
      </section>
    </main>
  );
}

export default RegisterSuccess;