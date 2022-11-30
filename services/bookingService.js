const bookingDao = require("../models/bookingDao");

const getcities = async () => {
  return await bookingDao.getcities();
};

module.exports = { getcities };
