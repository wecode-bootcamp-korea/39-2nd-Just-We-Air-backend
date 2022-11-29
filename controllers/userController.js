const userService = require("../services/userService");
const { catchAsync } = require("../utils/error");

const signIn = catchAsync(async (req, res) => {
  const { kakaoAccessToken } = req.body;

  const data = await userService.getKakaoUserInfo(kakaoAccessToken);

  return res.status(200).json(data);
});

const userUpdate = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, birth, mobile_number, email } = req.body;

  const result = await userService.updateUserInfo(
    userId,
    first_name,
    last_name,
    birth,
    mobile_number,
    email
  );
  return res.status(200).json({ message: "Updated User Information" });
});

const getUserInfo = catchAsync(async (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = {
  signIn,
  userUpdate,
  getUserInfo,
};
