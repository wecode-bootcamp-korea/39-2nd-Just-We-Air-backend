const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const route = require("./routes");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  app.use(route);

  return app;
};

module.exports = { createApp };
