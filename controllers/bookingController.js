const bookingService = require("../services/bookingService");
const { catchAsync, raiseCustomError } = require("../utils/error");

const getCities = catchAsync(async (req, res) => {
  const cities = await bookingService.getCities();
  return res.status(200).json({ countries: cities });
});

const searchFlight = catchAsync(async (req, res) => {
  const { date, departureId, arrivalId } = req.query;
  const MINDEPARTUREID = 1;
  const MAXDEPARTUREID = 11;

  if (!date || !departureId || !arrivalId) {
    raiseCustomError("No data", 400);
  }
  if (
    departureId < MINDEPARTUREID ||
    departureId > MAXDEPARTUREID ||
    arrivalId < MINDEPARTUREID ||
    arrivalId > MAXDEPARTUREID
  ) {
    raiseCustomError("invalid data", 400);
  }

  const flights = await bookingService.searchFlight(
    date,
    departureId,
    arrivalId
  );
  return res.status(200).json({ tickets: flights });
});

const getLowestPrice = catchAsync(async (req, res) => {
  const { date, departureId, arrivalId } = req.query;
  const MINDEPARTUREID = 1;
  const MAXDEPARTUREID = 11;

  if (!date || !departureId || !arrivalId) {
    raiseCustomError("No data", 400);
  }
  if (
    departureId < MINDEPARTUREID ||
    departureId > MAXDEPARTUREID ||
    arrivalId < MINDEPARTUREID ||
    arrivalId > MAXDEPARTUREID
  ) {
    raiseCustomError("invalid data", 400);
  }

  const price = await bookingService.getLowestPrice(
    date,
    departureId,
    arrivalId
  );
  return res.status(200).json({ price });
});

module.exports = { getCities, searchFlight, getLowestPrice };
