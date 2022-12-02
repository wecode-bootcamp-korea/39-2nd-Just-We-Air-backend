const orderService = require("../services/orderService");
const { catchAsync, raiseCustomError } = require("../utils/error");

const createOrderInfo = catchAsync(async (req, res) => {
  const { total_price, orderInfo } = req.body;
  const userId = req.user;

  if (!total_price || orderInfo.length === 0) {
    raiseCustomError("BAD_REQUEST", 400);
  }

  await orderService.createOrderInfo(userId, total_price, orderInfo);

  return res.status(200).json({ message: "SAVED_ORDER_INFO" });
});

const getOrderInfo = catchAsync(async (req, res) => {
  const userId = req.user;

  const data = await orderService.getOrderInfo(userId);

  return res.status(200).json(data);
});

module.exports = {
  createOrderInfo,
  getOrderInfo,
};
