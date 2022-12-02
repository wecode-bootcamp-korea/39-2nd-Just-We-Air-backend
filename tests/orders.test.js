const request = require("supertest");
const { loginRequired } = require("../utils/auth");

jest.mock("../utils/auth", () => ({ loginRequired: jest.fn() }));

const { createApp } = require("../app");
const { appDataSource } = require("../models/dataSource");

describe("Order Information", () => {
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

    await appDataSource.query(
      `INSERT INTO countries (name)
        VALUES ('대한민국')`
    );

    await appDataSource.query(
      `INSERT INTO cabin_types (name)
        VALUES ('스탠다드'), ('플렉스'), ('프레스티지')`
    );

    await appDataSource.query(
      `INSERT INTO cities (name, country_id)
        VALUES ('서울(인천)', 1), ("서울(김포)", 1), ("제주", 1)
        `
    );

    await appDataSource.query(
      `INSERT INTO order_stauts (status)
           VALUES ('Open'),('Completed'), ('Cancelled')        `
    );

    await appDataSource.query(
      `INSERT INTO users (kakao_id, first_name, last_name, birth, mobile_number,email)
          VALUES (12345, "John", "Doe", 19991231, "01045678932", "john12@gmail.com" )`
    );

    await appDataSource.query(
      `INSERT INTO tickets (departure_id, departure_date, arrival_id, arrival_date, flight_number)
        VALUES (2, "2022-12-09 12:00:00", 3, "2022-12-09 13:00:00", "2LKS12"),(3, "2022-12-09 12:00:00", 2, "2022-12-09 13:00:00", "2LKS12")
        `
    );
    await appDataSource.query(
      `INSERT INTO tickets_options (ticket_id, cabin_types_id, price)
        VALUES (1, 1, 30000), (1, 2, 50000), (1, 3, 1000000),(2, 1, 30000), (2, 2, 50000), (2, 3, 1000000)
        `
    );
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

  // 결제 정보 입력
  test("SUCCESS : SAVED_OREDER_INFO", async () => {
    loginRequired.mockImplementation((req, res, next) => {
      req.user = 1;
      next();
    });

    await request(app)
      .post("/orders")
      .send({
        total_price: 600000,
        orderInfo: [
          {
            ticket_option_id: 1,
            first_name: "Young",
            last_name: "Lee",
            birth: 19990921,
            gender: "여자",
            mobile_number: "01033332222",
            email: "young@gmail.com",
          },
          {
            ticket_option_id: 2,
            first_name: "Young",
            last_name: "Lee",
            birth: 19990921,
            gender: "여자",
            mobile_number: "01033332222",
            email: "young@gmail.com",
          },
        ],
      })
      .expect(200)
      .expect({ message: "SAVED_ORDER_INFO" });
  });

  test("FAIL : NOT SAVED ORDER_INFO ", async () => {
    loginRequired.mockImplementation((req, res, next) => {
      req.user = 1;
      next();
    });

    await request(app)
      .post("/orders")
      .send({
        orderInfo: [
          {
            ticket_option_id: 1,
            first_name: "Young",
            last_name: "Lee",
            birth: 19990921,
            gender: "여자",
            mobile_number: "01033332222",
            email: "young@gmail.com",
          },
          {
            ticket_option_id: 2,
            first_name: "Young",
            last_name: "Lee",
            birth: 19990921,
            gender: "여자",
            mobile_number: "01033332222",
            email: "young@gmail.com",
          },
        ],
      })
      .expect(400)
      .expect({ message: "BAD_REQUEST" });
  });

  test("SUCCESS : GET USER INFO ", async () => {
    loginRequired.mockImplementation((req, res, next) => {
      req.user = 1;
      next();
    });

    await request(app).get("/orders").expect(200);
  });
});
