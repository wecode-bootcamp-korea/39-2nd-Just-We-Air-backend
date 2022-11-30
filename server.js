require("dotenv").config();

const { createApp } = require("./app");
const { appDataSource } = require("./models/dataSource");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;
  await appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}~~`);
  });
};

startServer();
