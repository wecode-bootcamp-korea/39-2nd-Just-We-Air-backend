const passengerService = require("../services/passengerService");
const { catchAsync, raiseCustomError } = require("../utils/error");

const createPassenger = catchAsync(async (req, res) => {
  const { first_name, last_name, birth, gender, mobile_number, email } =
    req.body;

  if (
    !first_name ||
    !last_name ||
    !birth ||
    !gender ||
    !mobile_number ||
    !email
  ) {
    raiseCustomError("Invalid Data Input", 400);
  }

  const data = await passengerService.createPassenger(
    first_name,
    last_name,
    birth,
    gender,
    mobile_number,
    email
  );

  return res.status(200).json({ passengerId: data });
});

module.exports = {
  createPassenger,
};
