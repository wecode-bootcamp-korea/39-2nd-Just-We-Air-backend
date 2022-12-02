const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const { bookingRouter } = require("./bookingRouter");
const passengerRouter = require("./passengerRouter");

router.use("/booking", bookingRouter);

router.use("/users", userRouter);

router.use("/passengers", passengerRouter);

module.exports = router;
