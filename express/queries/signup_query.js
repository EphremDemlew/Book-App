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

module.exports = SIGNUP_HASURA_OPERATION;
