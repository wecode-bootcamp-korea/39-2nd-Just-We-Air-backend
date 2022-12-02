const request = require("supertest");
const axios = require("axios");
const { loginRequired } = require("../utils/auth");

jest.mock("axios");
jest.mock("../utils/auth", () => ({ loginRequired: jest.fn() }));

const { createApp } = require("../app");
const { appDataSource } = require("../models/dataSource");

describe("User Information", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();

    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE TABLE countries`);
    await appDataSource.query(`TRUNCATE TABLE cities`);
    await appDataSource.query(`TRUNCATE TABLE orders_tickets`);
    await appDataSource.query(`TRUNCATE TABLE orders`);
    await appDataSource.query(`TRUNCATE TABLE passengers`);
    await appDataSource.query(`TRUNCATE TABLE tickets_options`);
    await appDataSource.query(`TRUNCATE TABLE tickets`);
    await appDataSource.query(`TRUNCATE TABLE cabin_types`);
    await appDataSource.query(`TRUNCATE TABLE order_stauts`);
    await appDataSource.query(`TRUNCATE TABLE users`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);
  });

  afterAll(async () => {
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE TABLE countries`);
    await appDataSource.query(`TRUNCATE TABLE cities`);
    await appDataSource.query(`TRUNCATE TABLE orders_tickets`);
    await appDataSource.query(`TRUNCATE TABLE orders`);
    await appDataSource.query(`TRUNCATE TABLE passengers`);
    await appDataSource.query(`TRUNCATE TABLE tickets_options`);
    await appDataSource.query(`TRUNCATE TABLE tickets`);
    await appDataSource.query(`TRUNCATE TABLE cabin_types`);
    await appDataSource.query(`TRUNCATE TABLE order_stauts`);
    await appDataSource.query(`TRUNCATE TABLE users`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);
    await appDataSource.destroy();
  });

  beforeEach(async () => {
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE TABLE users`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);
  });

  // 카카오 소셜 로그인
  test("SUCCESS : kakao sign-in", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id, first_name, last_name, birth, mobile_number,email)
        VALUES (12345, "John", "Doe", 19991231, "01045678932", "john12@gmail.com" )`
    );

    axios.mockReturnValue(
      Promise.resolve({
        data: {
          id: 12345,
          kakao_account: {
            email: "young@gmail.com",
            profile: {
              nickname: "영",
              profile_image_url: "image.jpg",
            },
          },
        },
      })
    );

    await request(app)
      .post("/users/signin")
      .send({
        kakaoAccessToken: "aaaaaa",
      })
      .expect(200);
  });

  test("NEED TO UPDATE : kakao sign-in", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id)
        VALUES (12345)`
    );

    axios.mockReturnValue(
      Promise.resolve({
        data: {
          id: 12345,
          kakao_account: {
            email: "young@gmail.com",
            profile: {
              nickname: "영",
              profile_image_url: "image.jpg",
            },
          },
        },
      })
    );

    await request(app)
      .post("/users/signin")
      .expect(400)
      .expect({ message: "BAD_REQUEST" });
  });

  // 사용자 정보 Update
  test("SUCCESS : Updated user info", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id)
        VALUES (12345)`
    );

    loginRequired.mockImplementation((req, res, next) => {
      req.user = 1;
      next();
    });

    await request(app)
      .post("/users")
      .set({
        authorization: "dddddd",
      })
      .send({
        first_name: "John",
        last_name: "Doe",
        birth: 19991231,
        mobile_number: "01045678932",
        email: "john12@gmail.com",
      })
      .expect(200)
      .expect({ message: "Updated User Information" });
  });

  test("FAIL: Updated user info", async () => {
    loginRequired.mockImplementation((req, res, next) => {
      req.user = 1;
      next();
    });

    await request(app)
      .post("/users")
      .send({
        first_name: "John",
        last_name: "Doe",
        birth: 19991231,
        email: "john12@gmail.com",
      })
      .expect(400)
      .expect({ message: "BAD_REQUEST" });
  });

  // 사용자 정보 가져오기
  test("SUCESS: Get user Info", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id, first_name, last_name, birth, mobile_number,email)
        VALUES (12345, "John", "Doe", 19991231, "01045678932", "john12@gmail.com" )`
    );

    loginRequired.mockImplementation((req, res, next) => {
      req.user = 1;
      next();
    });

    await request(app).get("/users").expect(200).expect({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      birth: "1999-12-30T15:00:00.000Z",
      mobile_number: "01045678932",
      email: "john12@gmail.com",
    });
  });
});
