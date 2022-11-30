const express = require("express");
const router = express.Router();

const { bookingRouter } = require("./bookingRouter");

router.use("/booking", bookingRouter);

module.exports = router;
