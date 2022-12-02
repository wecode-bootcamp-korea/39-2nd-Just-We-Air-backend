const express = require("express");
const passengerController = require("../controllers/passengerController");
const { loginRequired } = require("../utils/auth");

const router = express.Router();

router.post("", loginRequired, passengerController.createPassenger);

module.exports = router;
