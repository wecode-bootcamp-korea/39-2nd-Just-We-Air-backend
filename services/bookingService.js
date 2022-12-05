const bookingDao = require("../models/bookingDao");
const moment = require("moment");

const getCities = async () => {
  return await bookingDao.getCities();
};

const searchFlight = async (date, departureId, arrivalId) => {
  const flights = await bookingDao.searchFlight(date, departureId, arrivalId);
  return flights;
};

const getLowestPrice = async (date, departureId, arrivalId) => {
  const lastDate = moment(date).add(13, "d").format("YYYY-MM-DD");
  return await bookingDao.getLowestPrice(
    date,
    lastDate,
    departureId,
    arrivalId
  );
};

module.exports = { getCities, searchFlight, getLowestPrice };
