const express = require("express");
const emailController = require("../controllers/emailController");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.get("", loginRequired, emailController.sendTicket);

module.exports = router;
