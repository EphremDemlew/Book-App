const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const signup_query = require("./queries/signup_query");
const login_query = require("./queries/login_query");
const fileUpload_query = require("./queries/fileUploade_query");
const fileUploade = require("./file_uploade/book_file_uploade");
// const checkOut = require("./checkout");
// const payVerification = require("./checkout");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors())

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cors())
// app.use(helmet());

//app.use(function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //next();
//});

app.get("/", (req, res) => {
  res.send("Server running ... ");
});

// signup query execute
const signup_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: signup_query,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// login query execute
const login_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: login_query,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// file Upload query execute
const fileUpload_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: fileUpload_query,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// Sign Up Request Handler
app.post("/signup", async (req, res) => {
  // get request input
  const { email, first_name, last_name, isAuthor, author_id } = req.body.input;

  // run some business logic
  const password = await bcrypt.hash(req.body.input.password, 10);
  // execute the Hasura operation

  const { data, errors } = await signup_execute({
    email,
    first_name,
    last_name,
    password,
    isAuthor,
  });


  console.log(data);


  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  const tokenContents = {
    sub: data.insert_users_one.id,
    name: first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user", "anonymous", "author"],
      "x-hasura-user-id": data.insert_users_one.id,
      "x-hasura-default-role": "user",
      "x-hasura-role": "user",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  // token claim for users
  const usertokenContents = {
    sub: data.insert_users_one.id,
    name: first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user", "anonymous", "author"],
      "x-hasura-user-id": data.insert_users_one.id,
      "x-hasura-default-role": "user",
      "x-hasura-role": "user",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  // token claim for authors
  const authortokenContents = {
    sub: data.insert_users_one.id,
    name: first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user", "anonymous", "author"],
      "x-hasura-user-id": data.insert_users_one.id,
      "x-hasura-default-role": "author",
      "x-hasura-role": "author",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(
    data.insert_users_one.isAuthor ? authortokenContents : usertokenContents,
    process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  );
  console.log(data.insert_users_one.isAuthor);
  console.log(token);
  // success

  console.log(data.author_id);
  data.author_id;
  return res.json({
    ...data.insert_users_one,
    token: token,
  });
});

// Login Request Handler
app.post("/Login", async (req, res) => {
  // get request input
  const { email, password } = req.body.input;

  const { data, errors } = await login_execute({ email });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }
  if (data.users.length === 0) {
    return res
      .status(400)
      .json({ message: "Account not found, Please Sign Up." });
  }
  const validPassword = await bcrypt.compare(password, data.users[0].password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid Email or Password." });
  console.log("The password is " + validPassword);

  // token claim for users
  const usertokenContents = {
    sub: data.users[0].id,
    name: data.users[0].first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user", "anonymous", "author"],
      "x-hasura-user-id": data.users[0].id,
      "x-hasura-default-role": "user",
      "x-hasura-role": "user",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  // token claim for authors
  const authortokenContents = {
    sub: data.users[0].id,
    name: data.users[0].first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user", "anonymous", "author"],
      "x-hasura-user-id": data.users[0].id,
      "x-hasura-default-role": "author",
      "x-hasura-role": "author",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(
    data.users[0].isAuthor ? authortokenContents : usertokenContents,
    process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  );

  console.log("......................");
  console.log(token);
  console.log("......................");

  // success
  return res.json({
    ...data.users[0],
    token: token,
  });
});

let config = {
  headers: {
    Authorization: "Bearer " + process.env.CHAPA_SECRET_KEY,
  },
};
// Checkout request handler
app.post("/order", async (req, res) => {
  try {
    //TODO: populate from DB
    let tx_ref = "tx-myecommerce12345" + Date.now();
    console.log(tx_ref);

    let result = await axios.postForm(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: req.body.total_price,
        currency: "ETB",
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        tx_ref: tx_ref,
        callback_url: "http://localhost:5000/api/success?tx_ref=" + tx_ref,
        // "customization[title]": "I love e-commerce",
        // "customization[description]": "It is time to pay",
      },
      config
    );
    console.log("result");
    console.log(result.data);
    //returning back the checkout url to Frontend

    res.send(result.data);
  } catch (error) {
    console.log(error.data);
    res.send("error message " + error);
  }
});

// Checkout verification handler
// app.post("/orderVerify", payVerification);

// Request Handler
app.post("/addBook", fileUploade);

app.get("/api/success", (req, res) => {
  console.log("sucess");
  const ref = req.query.tx_ref;

  res.json({ message: "sucessfully checked out" });
});
// Callback from chapa
app.get("/callbackurl", (req, res) => {
  console.log(req, res);

  res.json({ message: "Got here" });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
