const express = require("express");

const bookingRouter = express.Router();

const bookingController = require("../controllers/bookingController");

bookingRouter.get("/cities", bookingController.getCities);
bookingRouter.get("/flights", bookingController.searchFlight);

module.exports = { bookingRouter };
