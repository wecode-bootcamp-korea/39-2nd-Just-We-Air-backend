const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const { bookingRouter } = require("./bookingRouter");
const orderRouter = require("./orderRouter");
const paymentRouter = require("./paymentRouter");
const emailRouter = require("./emailRouter");

router.use("/booking", bookingRouter);

router.use("/users", userRouter);

router.use("/orders", orderRouter);

router.use("/payments", paymentRouter);

router.use("/tickets", emailRouter);

module.exports = router;
