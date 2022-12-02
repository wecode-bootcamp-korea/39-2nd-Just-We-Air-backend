const orderDao = require("../models/orderDao");
const { v4 } = require("uuid");

const createOrderInfo = async (userId, total_price, orderInfo) => {
  const uuid = () => v4().split("-")[0];

  const orderNumber = uuid();
  const orderId = await orderDao.createOrder(userId, total_price, orderNumber);

  for (items of orderInfo) {
    const {
      ticket_option_id,
      first_name,
      last_name,
      birth,
      gender,
      mobile_number,
      email,
    } = items;

    const ticketNumber = uuid();

    await orderDao.orderInfoTransaction(
      orderId,
      ticket_option_id,
      first_name,
      last_name,
      birth,
      gender,
      mobile_number,
      email,
      ticketNumber
    );
  }
};

const getOrderInfo = async (userId) => {
  return await orderDao.getOrderInfo(userId);
};

module.exports = {
  createOrderInfo,
  getOrderInfo,
};
