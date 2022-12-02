const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../models/dataSource");

describe("Passenger Information", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE passengers`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1`);
    await appDataSource.destroy();
  });

  beforeEach(async () => {
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE TABLE passengers`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);
  });

  test("SUCCESS : Create Passenger info", async () => {
    await request(app)
      .post("/passengers")
      .set({
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5NjI1MjR9.hsuNM4ZwUcZjWqhIZpffqU-9kFLhhuZHgBfSMYKaELc",
      })
      .send({
        first_name: "JJANGU",
        last_name: "Ya",
        birth: "2000-03-21",
        gender: "남자",
        mobile_number: "01011111111",
        email: "jjangu@gmail.com",
      })
      .expect(200)
      .expect({ passengerId: 1 });
  });

  test("FAIL : Invalid input", async () => {
    await request(app)
      .post("/passengers")
      .set({
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5NjI1MjR9.hsuNM4ZwUcZjWqhIZpffqU-9kFLhhuZHgBfSMYKaELc",
      })
      .send({
        first_name: "JJANGU",
        last_name: "Ya",
        birth: "2000-03-21",
        mobile_number: "01011111111",
        email: "jjangu@gmail.com",
      })
      .expect(400)
      .expect({ message: "Invalid Data Input" });
  });
});
