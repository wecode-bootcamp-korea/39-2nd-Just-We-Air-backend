const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../models/dataSource");

describe("book tickets", () => {
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
    await appDataSource.query(`TRUNCATE TABLE orders_tickets`);
    await appDataSource.query(`TRUNCATE TABLE orders`);
    await appDataSource.query(`TRUNCATE TABLE passengers`);
    await appDataSource.query(`TRUNCATE TABLE tickets_options`);
    await appDataSource.query(`TRUNCATE TABLE tickets`);
    await appDataSource.query(`TRUNCATE TABLE cabin_types`);
    await appDataSource.query(`TRUNCATE TABLE order_stauts`);
    await appDataSource.query(`TRUNCATE TABLE cities`);
    await appDataSource.query(`TRUNCATE TABLE countries`);
    await appDataSource.query(`TRUNCATE TABLE users`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);
    await appDataSource.destroy();
  });

  beforeEach(async () => {
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 0`);
    await appDataSource.query(`TRUNCATE TABLE orders_tickets`);
    await appDataSource.query(`TRUNCATE TABLE orders`);
    await appDataSource.query(`TRUNCATE TABLE passengers`);
    await appDataSource.query(`TRUNCATE TABLE tickets_options`);
    await appDataSource.query(`TRUNCATE TABLE tickets`);
    await appDataSource.query(`TRUNCATE TABLE cabin_types`);
    await appDataSource.query(`TRUNCATE TABLE order_stauts`);
    await appDataSource.query(`TRUNCATE TABLE cities`);
    await appDataSource.query(`TRUNCATE TABLE countries`);
    await appDataSource.query(`TRUNCATE TABLE users`);
    await appDataSource.query(`set FOREIGN_KEY_CHECKS = 1`);

    await appDataSource.query(
      `INSERT INTO cabin_types (name)
        VALUES ('스탠다드'), ('플렉스'), ('프레스티지')`
    );
    await appDataSource.query(
      `INSERT INTO countries (name)
        VALUES ('대한민국')`
    );
    await appDataSource.query(
      `INSERT INTO cities (name, country_id)
        VALUES ('서울(인천)', 1), ("서울(김포)", 1), ("제주", 1)
        `
    );
    await appDataSource.query(
      `INSERT INTO tickets (departure_id, departure_date, arrival_id, arrival_date, flight_number)
        VALUES (2, "2022-12-09 12:00:00", 3, "2022-12-09 13:00:00", "2LKS12")
        `
    );
    await appDataSource.query(
      `INSERT INTO tickets_options (ticket_id, cabin_types_id, price)
        VALUES (1, 1, 30000), (1, 2, 50000), (1, 3, 1000000)
        `
    );
  });

  test("SUCCESS: get cities", async () => {
    await request(app)
      .get("/booking/cities")
      .expect(200)
      .expect({
        countries: [
          {
            country_id: 1,
            name: "대한민국",
            cities: [
              {
                id: 1,
                name: "서울(인천)",
              },
              {
                id: 2,
                name: "서울(김포)",
              },
              {
                id: 3,
                name: "제주",
              },
            ],
          },
        ],
      });
  });

  test("SUCCESS: get flights", async () => {
    await request(app)
      .get("/booking/flights?date=2022-12-09&departureId=2&arrivalId=3")
      .expect(200)
      .expect({
        tickets: [
          {
            tickets_id: 1,
            departure_date: "2022-12-09T03:00:00.000Z",
            arrival_date: "2022-12-09T04:00:00.000Z",
            flight_number: "2LKS12",
            tickets_options: [
              {
                price: 30000,
                cabin_type: "스탠다드",
                ticket_option_id: 1,
              },
              {
                price: 50000,
                cabin_type: "플렉스",
                ticket_option_id: 2,
              },
              {
                price: 1000000,
                cabin_type: "프레스티지",
                ticket_option_id: 3,
              },
            ],
          },
        ],
      });
  });

  test("SUCCESS: get lowest price", async () => {
    await request(app)
      .get("/booking/lowest-price?date=2022-12-09&departureId=2&arrivalId=3")
      .expect(200)
      .expect({
        price: [
          {
            date: "22-12-09",
            lowest_price: "30000.00",
          },
        ],
      });
  });

  test("FAIL: get lowest price - invaild query", async () => {
    await request(app)
      .get("/booking/lowest-price?date=2022-12-09&departureId=2&arrivalId=99")
      .expect(400)
      .expect({
        message: "invalid data",
      });
  });

  test("FAIL: get lowest price - no data", async () => {
    await request(app).get("/booking/lowest-price").expect(400).expect({
      message: "No data",
    });
  });
});
