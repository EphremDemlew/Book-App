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

// Sign up query
const SIGNUP_HASURA_OPERATION = `
mutation sign_up($email: String = "ephy@gmail.com", $first_name: String = "",$isAuthor: Boolean = "false", $last_name: String = "", $password: String = "") {
  insert_users_one(object: {email: $email, first_name: $first_name, last_name: $last_name, password: $password , isAuthor: $isAuthor}) {
    id
    email
    first_name
    last_name
    isAuthor
  }
}
`;

// Login Query
const LOGIN_HASURA_OPERATION = `
query login($email: String!){
  users(where: {email: {_eq: $email}}){
		id
    email
    password
    isAuthor
    first_name
  }
}
`;
// signup query execute
const signup_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: SIGNUP_HASURA_OPERATION,
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
  const { email, first_name, last_name, isAuthor } = req.body.input;

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
  return res.json({
    ...data.insert_users_one,
    token: token,
  });
});

// Login Request Handler
app.post("/Login", async (req, res) => {
  // get request input
  const { email, password } = req.body.input;

  console.log(email, password);
  const { data, errors } = await login_execute({ email });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

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

  // if (data.users[0].isAuthor) {
  //   console.log("He is an Author of the book.");
  //   const token = jwt.sign(
  //     authortokenContents,
  //     process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  //   );
  // } else if (!data.users[0].isAuthor) {
  //   const token = jwt.sign(
  //     usertokenContents,
  //     process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  //   );
  // }
  console.log(token);

  // success
  return res.json({
    ...data.users[0],
    token: token,
  });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
