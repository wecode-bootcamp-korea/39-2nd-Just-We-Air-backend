const express = require("express");
const router = express.Router();

const userRouter = require("./userRouter");
const { bookingRouter } = require("./bookingRouter");

router.use("/booking", bookingRouter);

router.use("/users", userRouter);

module.exports = router;
