const soldItems = `mutation soldItems($sales: numeric!, $sales_count: Int!, $user_id: uuid!, $book_id: uuid!) {
    insert_sold_items(objects: {sales: $sales, sales_count: $sales_count, user_id: $user_id, book_id: $book_id}) {
      returning {
        id
      }
    }
  }
  `;

module.exports = soldItems;
