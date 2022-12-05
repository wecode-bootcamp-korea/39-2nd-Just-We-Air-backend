const express = require("express");

const bookingRouter = express.Router();

const bookingController = require("../controllers/bookingController");

bookingRouter.get("/cities", bookingController.getCities);
bookingRouter.get("/flights", bookingController.searchFlight);
bookingRouter.get("/lowest-price", bookingController.getLowestPrice);

module.exports = { bookingRouter };
