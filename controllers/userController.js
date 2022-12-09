const userService = require("../services/userService");
const { catchAsync, raiseCustomError } = require("../utils/error");

const signIn = catchAsync(async (req, res) => {
  const { kakaoAccessToken } = req.body;

  if (!kakaoAccessToken) {
    raiseCustomError("BAD_REQUEST", 400);
  }

  const data = await userService.getKakaoUserInfo(kakaoAccessToken);

  return res.status(200).json(data);
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.user;
  const { first_name, last_name, birth, mobile_number, email } = req.body;

  if (!first_name || !last_name || !birth || !mobile_number || !email) {
    raiseCustomError("BAD_REQUEST", 400);
  }

  await userService.updateUserInfo(
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
  userId = req.user;
  data = await userService.getUserById(userId);
  return res.status(200).json(data);
});

module.exports = {
  signIn,
  updateUser,
  getUserInfo,
};
