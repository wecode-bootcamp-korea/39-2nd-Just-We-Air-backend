const { catchAsync, raiseCustomError } = require("../utils/error");
const paymentServie = require("../services/paymentService");

const savePayment = catchAsync(async (req, res) => {
  const paymentKey = req.body.paymentKey;

  await paymentServie.savePayment(paymentKey);
  return res.status(200).json({ message: "SUCCESS" });
});

module.exports = { savePayment };
