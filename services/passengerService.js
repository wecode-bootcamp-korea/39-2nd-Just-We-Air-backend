const passengerDao = require("../models/passengerDao");

const createPassenger = async (
  first_name,
  last_name,
  birth,
  gender,
  mobile_number,
  email
) => {
  const isPassenger = await passengerDao.getPassengerInfo(email);

  if (!isPassenger) {
    await passengerDao.createPassenger(
      first_name,
      last_name,
      birth,
      gender,
      mobile_number,
      email
    );
    return await passengerDao.getPassengerInfo(email);
  }

  return isPassenger;
};

module.exports = {
  createPassenger,
};
