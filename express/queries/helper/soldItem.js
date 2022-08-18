const sold = async () => {
  const { data, errors } = await soldItems_execute({
    sales_count,
    sales,
    book_id,
    user_id,
  });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }
};

module.exports = sold;
