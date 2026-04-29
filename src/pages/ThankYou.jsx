import "../styles/person3-payment-review.css";

function ThankYou({ customer }) {
  return (
    <main className="p3-review-phone">
      <section className="p3-review-topbar"></section>

      <section className="p3-thank-card">
        <div className="p3-thank-icon">✓</div>

        <h1>ขอบคุณสำหรับความคิดเห็นของคุณ!</h1>

        <p>
          คุณ{customer?.MFirstName} {customer?.MSurName}
        </p>
      </section>
    </main>
  );
}

export default ThankYou;