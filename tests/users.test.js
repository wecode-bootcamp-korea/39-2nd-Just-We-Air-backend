const request = require("supertest");
const axios = require("axios");

const { createApp } = require("../app");
const { appDataSource } = require("../models/dataSource");
const { JsonWebTokenError } = require("jsonwebtoken");

jest.mock("axios");

describe("User Information", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
  });

  afterAll(async () => {
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE users`);
    await appDataSource.query(`SET FOREIGN_KEY_CHECKS = 1`);
    await appDataSource.destroy();
  });

  beforeEach(async () => {
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE TABLE users`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);
  });

  test("SUCCESS : Updated user info", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id)
        VALUES (12345)`
    );
    await request(app)
      .post("/users/update")
      .set({
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5MDA3NTF9.JCB5xe41o2Mg2f3nncmOm8ShTr3Z6wv_roeuctv-6fo",
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
    await request(app)
      .post("/users/update")
      .set({
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5MDA3NTF9.JCB5xe41o2Mg2f3nncmOm8ShTr3Z6wv_roeuctv-6fo",
      })
      .send({
        first_name: "John",
        last_name: "Doe",
        birth: 19991231,
        mobile_number: "01045678932",
        email: "john12@gmail.com",
      })
      .expect(401)
      .expect({ message: "USER_DOES_NOT_EXIST" });
  });

  test("SUCESS: Get user Info", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id, first_name, last_name, birth, mobile_number,email)
        VALUES (12345, "John", "Doe", 19991231, "01045678932", "john12@gmail.com" )`
    );
    await request(app)
      .get("/users")
      .set({
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5MDA3NTF9.JCB5xe41o2Mg2f3nncmOm8ShTr3Z6wv_roeuctv-6fo",
      })
      .expect(200)
      .expect({
        id: 1,
        first_name: "John",
        last_name: "Doe",
        birth: "1999-12-30T15:00:00.000Z",
        mobile_number: "01045678932",
        email: "john12@gmail.com",
      });
  });

  test("FAIL: Get user Info", async () => {
    await appDataSource.query(
      `INSERT INTO users (kakao_id, first_name, last_name, birth, mobile_number,email)
        VALUES (12345, "John", "Doe", 19991231, "01045678932", "john12@gmail.com" )`
    );
    await request(app)
      .get("/users")
      .expect(401)
      .expect({ message: "NEED_ACCESS_TOKEN" });
  });

  test("SUCCESS: kakao singin", async () => {
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

    await request(app).post("/users/signin").expect(200).expect({
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5MDA3NTF9.JCB5xe41o2Mg2f3nncmOm8ShTr3Z6wv_roeuctv-6fo",
      needUpdateUserProfile: true,
    });
  });

  test("SUCCESS: kakao singin", async () => {
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

    await request(app).post("/users/signin").expect(200).expect({
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cGlyZXNJbiI6IjMwIGRheXMiLCJpYXQiOjE2Njk5MDA3NTF9.JCB5xe41o2Mg2f3nncmOm8ShTr3Z6wv_roeuctv-6fo",
      needUpdateUserProfile: false,
    });
  });
});
