const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const { bookingRouter } = require("./bookingRouter");
const orderRouter = require("./orderRouter");

router.use("/booking", bookingRouter);

router.use("/users", userRouter);

router.use("/orders", orderRouter);

module.exports = router;
