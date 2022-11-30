const bookingService = require("../services/bookingService");

const getcities = async (req, res) => {
  const cities = await bookingService.getcities();
  return res.status(200).json({ countries: cities });
};

module.exports = { getcities };
