const axios = require("axios");
require("dotenv").config();

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
        amount: req.total_price,
        currency: "ETB",
        email: req.email,
        first_name: req.first_name,
        last_name: req.last_name,
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
const payVerification = async (req, res) => {
  //payment verification

  console.log(
    "executed when payment is successful-redirected by chapa to this url"
  );

  try {
    let result = await axios.get(
      "https://api.chapa.co/v1/transaction/verify/" + req.query.tx_ref,
      config
    );

    console.log("Result: " + result.data);
    //TODO: save transaction
    res.send(" payment transaction result " + JSON.stringify(result.data));
  } catch (error) {
    console.log("something happened " + error);
    res.send(" something happened " + error);
  }
};

module.exports = checkOut;

module.exports = payVerification;
