let config = {
  headers: {
    Authorization: "Bearer " + process.env.CHAPA_SECRET_KEY,
  },
};
const checkOut = async (req, res) => {
  try {
    //TODO: populate from DB
    let tx_ref = "tx-myecommerce12345." + Date.now();
    let result = await axios.postForm(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: "total price",
        currency: "ETB",
        email: "user email",
        first_name: "Abebe",
        last_name: "Bikila",
        tx_ref: tx_ref,
        callback_url: "http://localhost:3001/api/success?tx_ref=" + tx_ref,
        "customization[title]": "I love e-commerce",
        "customization[description]": "It is time to pay",
      },
      config
    );

    console.log(result.data);
    //returning back the checkout url to Frontend

    res.send(result.data);
  } catch (error) {
    console.log(error.data);
    res.send("error message " + error);
  }
};

module.exports = checkOut;
