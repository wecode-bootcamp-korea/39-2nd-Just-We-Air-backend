const { appDataSource } = require("./dataSource");

const getUserByKakaoId = async (kakaoId) => {
  const user = await appDataSource.query(
    `SELECT
            id, 
            kakao_id,
            first_name,
            last_name,
            birth,
            mobile_number,
            email   
        FROM users
        WHERE kakao_id =?`,
    [kakaoId]
  );
  return user[0];
};

const storeKakaoId = async (kakaoId) => {
  return await appDataSource.query(
    `
    INSERT INTO users (
        kakao_id
    ) VALUES (?);
    `,
    [kakaoId]
  );
};

const updateUser = async (
  userId,
  first_name,
  last_name,
  birth,
  mobile_number,
  email
) => {
  console.log(userId, first_name, last_name, birth, mobile_number, email);
  await appDataSource.query(
    `UPDATE users
    SET first_name =?,last_name =?,birth=?,mobile_number= ?,email = ?
    WHERE id = ?
    `,
    [first_name, last_name, birth, mobile_number, email, userId]
  );
};

const getUserById = async (id) => {
  const result = await appDataSource.query(
    `
		SELECT 
      id,
      first_name,
      last_name,
      birth,
      mobile_number,
      email
    FROM users
		WHERE id=?`,
    [id]
  );

  return result[0];
};

module.exports = {
  getUserByKakaoId,
  storeKakaoId,
  updateUser,
  getUserById,
};
