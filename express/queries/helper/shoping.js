const shopping = async () => {
  const { data, errors } = await shoping_execute({
    book_id,
    user_id,
  });
  // if Hasura operation errors, then throw error
  if (errors) {
    console.log("found the error part");
    return res.status(400).json(errors[0]);
  }
};

module.exports = shopping;
