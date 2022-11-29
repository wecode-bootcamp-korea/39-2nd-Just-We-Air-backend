const express = require("express");
const userController = require("../controllers/userController");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.post("/signin", userController.signIn);
router.post("/update", loginRequired, userController.userUpdate);
router.get("", loginRequired, userController.getUserInfo);

module.exports = router;
