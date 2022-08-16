export default function Payment() {
  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Payment</h2>
      <form method="POST" action="https://api.chapa.co/v1/hosted/pay">
        <input
          type="hidden"
          name="public_key"
          value="CHAPUBK_TEST-8zApSEiKaOH4l3TOXavhn2ZDayDIRo4d"
        />
        <input type="hidden" name="tx_ref" value="negade-tx-12345678sss9" />
        <br />
        <input type="input" name="amount" />
        <br />

        <input type="hidden" name="currency" value="ETB" />
        <br />

        <input type="email" name="email" />
        <br />

        <input type="input" name="first_name" />
        <br />

        <input type="input" name="last_name" />
        <br />

        <input type="input" name="title" />
        <br />

        <input
          type="hidden"
          name="description"
          value="Paying with Confidence with cha"
        />
        <input
          type="hidden"
          name="logo"
          value="https://yourcompany.com/logo.png"
        />
        <input
          type="hidden"
          name="callback_url"
          value="http://localhost:5000/callbackurl"
        />
        <input
          type="hidden"
          name="return_url"
          value="https://example.com/returnurl"
        />
        <input type="hidden" name="meta[title]" value="test" />
        <button type="submit">Pay Now</button>
      </form>
    </main>
  );
}
