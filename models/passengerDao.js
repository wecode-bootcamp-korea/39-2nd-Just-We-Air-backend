const { appDataSource } = require("./dataSource");

const createPassenger = async (
  first_name,
  last_name,
  birth,
  gender,
  mobile_number,
  email
) => {
  await appDataSource.query(
    `INSERT INTO passengers(
        first_name,
        last_name,
        birth,
        gender,
        mobile_number,
        email
      ) VALUES (?, ?, ?, ?, ?, ?);
      `,
    [first_name, last_name, birth, gender, mobile_number, email]
  );
};

const getPassengerInfo = async (email) => {
  const passengerId = await appDataSource.query(
    `SELECT 
      id
    FROM passengers
    WHERE email = ?
      `,
    [email]
  );
  return passengerId[0];
};

module.exports = {
  createPassenger,
  getPassengerInfo,
};
