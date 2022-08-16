// Admin Login Query

const ADMIN_LOGIN_HASURA_OPERATIONquery = `adminLogin {
    users(where: {_and: {id: {_eq: "f6cc9279-7917-4a8f-8899-9db5f250bb8f"}}, email: {_eq: "admin@gmail.com"}}) {
      id
      first_name
      last_name
      email
      password
    }
  }`;

module.exports = ADMIN_LOGIN_HASURA_OPERATIONquery;
