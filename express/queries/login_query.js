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

module.exports = LOGIN_HASURA_OPERATION;
