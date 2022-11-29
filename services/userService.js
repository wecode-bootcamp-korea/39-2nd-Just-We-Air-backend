const axios = require("axios");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const userDao = require("../models/userDao");

const getKakaoUserInfo = async (kakaoAccessToken) => {
  const result = await axios({
    method: "POST",
    url: "https://kapi.kakao.com/v2/user/me",
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      Authorization: `Bearer ${kakaoAccessToken}`,
    },
  });

  const kakaoId = result.data.id;

  const isUser = await userDao.getUserByKakaoId(kakaoId);
  let needUpdateUserProfile = false;

  if (!isUser) {
    await userDao.storeKakaoId(kakaoId);
    needUpdateUserProfile = true;
  }

  const user = await userDao.getUserByKakaoId(kakaoId);

  if (!user.email) {
    needUpdateUserProfile = true;
  }

  const payLoad = {
    userId: user.id,
    expiresIn: process.env.JWT_EXPIRES_IN,
  };

  const accessToken = jwt.sign(payLoad, secretKey);

  return {
    accessToken: accessToken,
    needUpdateUserProfile: needUpdateUserProfile,
  };
};

const updateUserInfo = async (
  userId,
  first_name,
  last_name,
  birth,
  mobile_number,
  email
) => {
  return await userDao.updateUser(
    userId,
    first_name,
    last_name,
    birth,
    mobile_number,
    email
  );
};

const getUserById = async (id) => {
  return await userDao.getUserById(id);
};

module.exports = {
  getKakaoUserInfo,
  updateUserInfo,
  getUserById,
};
