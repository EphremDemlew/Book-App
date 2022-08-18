const shoppingSession = `mutation shoppingSession($user_id: uuid = "", $book_id: uuid = "",) {
    insert_shopping_session(objects: {book_id: $book_id, user_id: $user_id}) {
      returning {
        id
      }
    }
  }`;
module.exports = shoppingSession;
