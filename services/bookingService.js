const bookingDao = require("../models/bookingDao");

const getCities = async () => {
  return await bookingDao.getCities();
};

const searchFlight = async (date, departureId, arrivalId) => {
  const flights = await bookingDao.searchFlight(date, departureId, arrivalId);
  return flights;
};

module.exports = { getCities, searchFlight };
