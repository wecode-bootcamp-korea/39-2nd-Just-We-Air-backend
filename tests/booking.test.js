const request = require("supertest");

const { createApp } = require("../app");
const { appDataSource } = require("../models/dataSource");
// test db 비워서 테스트코드에서 insert 후 테스트
describe("get cities", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
  });

  afterAll(async () => {
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
  });

  test("SUCCESS: get cities", async () => {
    await appDataSource.query(
      `INSERT INTO countries (name)
        VALUES ('대한민국')`
    );
    await appDataSource.query(
      `INSERT INTO cities (name, country_id)
        VALUES ('서울(인천)', 1), ("서울(김포)", 1), ("제주", 1)
        `
    );

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
});
