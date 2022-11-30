const express = require("express");

const bookingRouter = express.Router();

const bookingController = require("../controllers/bookingController");

bookingRouter.get("/", bookingController.getcities);

module.exports = { bookingRouter };
