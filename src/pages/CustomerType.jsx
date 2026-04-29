function CustomerType({ onGeneral, onMember, onReserve }) {
  return (
    <main className="p1-page">
      <section className="p1-customer-type-page">
        <div className="p1-restaurant-logo">
          <img
            className="p1-restaurant-logo-img"
            src="/image/logo.jpg"
            alt="CS Restaurant Logo"
          />
        </div>

        <div className="p1-customer-buttons">
          <button
            type="button"
            className="p1-customer-btn p1-customer-general"
            onClick={onGeneral}
          >
            General
          </button>

          <button
            type="button"
            className="p1-customer-btn p1-customer-member"
            onClick={onMember}
          >
            Member
          </button>
        </div>

        <button
          type="button"
          className="p1-customer-btn p1-customer-reserve"
          onClick={onReserve}
        >
          reserve
        </button>
      </section>
    </main>
  );
}

export default CustomerType;