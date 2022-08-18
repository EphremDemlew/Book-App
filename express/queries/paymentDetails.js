const paymentDetails = `mutation paymentDetail($status:String! , $order_id:uuid!) {
  insert_payment_details(objects: {status: $status, order_id: $order_id}) {
    returning {
      id
    }
  }
}
`;
module.exports = paymentDetails;
