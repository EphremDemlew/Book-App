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
mutation sign_up($email: String = "ephy@gmail.com", $first_name: String = "", $last_name: String = "", $password: String = "") {
  insert_users_one(object: {email: $email, first_name: $first_name, last_name: $last_name, password: $password}) {
    email
    first_name
    last_name
    id
  }
}
`;

// Login Query
const LOGIN_HASURA_OPERATION = `
query Login($email: String!, $password: String!) {
  users(where: {email: {_eq: $email}, password: {_eq: $password}}) {
    email
    first_name
    last_name
    gender
    order_items{
      sales_count
      sales
      book_id
      created_at
      updated_at
      payment_id
    }
    shopping_sessions{
      cart_items{
        book_id
        created_at
        updated_at
      }
      created_at
      updated_at
    }
    
    accounts{
      id
      balance
      name
    }
    book{
      id
      title
      ISBN
      categories{
        name
      }
      comment
      cover_photo
      description
      discount{
      active
      desc
        discount_percentage
        name
      }
      edition
      file
      page_size
      price
      published_at
      rating
      sample_file
      author_id
    }
    
    
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

  console.log("The name is ..." + data.insert_users_one.first_name);

  const token = jwt.sign(
    tokenContents,
    process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  );
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

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ email, password });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  // success
  return res.json({
    ...data.users,
  });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
