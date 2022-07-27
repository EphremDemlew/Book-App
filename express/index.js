const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(express.json());
// app.use(helmet());

app.get("/", (req, res) => {
  res.send("Server running ... ");
});

const SIGNUP_HASURA_OPERATION = `
mutation sign_up($email: String = "ephy@gmail.com", $first_name: String = "", $last_name: String = "", $password: String = "") {
  insert_users_one(object: {email: $email, first_name: $first_name, last_name: $last_name, password: $password}) {
    email
    first_name
    last_name
  }
}
`;
// execute the parent operation in Hasura
const signup_execute = async (variables) => {
  const fetchResponse = await fetch(
    "https://book-sales.hasura.app/v1/graphql",
    {
      method: "POST",
      //   headers: {
      //     "x-hasura-admin-secret": `${process.env.HASURA_GRAPHQL_ADMIN_SECRET}`,
      //   },
      body: JSON.stringify({
        query: SIGNUP_HASURA_OPERATION,
        variables,
      }),
    }
  );
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

const LOGIN_HASURA_OPERATION = `
query{
  books{
    id
    title
    ISBN
    category
    {
      name
    }
  }
}
`;

// execute the parent operation in Hasura
const login_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: LOGIN_HASURA_OPERATION,
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
  const { email, first_name, last_name } = req.body.input;

  // run some business logic
  const password = await bcrypt.hash(req.body.input.password, 10);
  // execute the Hasura operation
  const { data, errors } = await signup_execute({
    email,
    first_name,
    last_name,
    password,
  });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  const tokencontent = {
    sub: data.insert_users_one.id.toString(),
    name: first_name,
    iat: Date.now() / 1000,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["author", "user"],
      "x-hasura-user-id": data.insert_users_one.id.toString(),
      "x-hasura-default-role": "user",
      "x-hasura-role": "user",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(tokenContents, process.env.HASURA_JWT_SECRET_KEY);
  // success
  return res.json({
    ...data.insert_users_one,
  });
});

// Login Request Handler
app.post("/Login", async (req, res) => {
  // get request input
  const {} = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await login_execute({});
  console.log("The login handler");

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  // success
  return res.json({
    ...data.books,
  });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
