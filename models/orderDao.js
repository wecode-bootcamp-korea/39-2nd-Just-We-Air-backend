const { appDataSource } = require("./dataSource");

const createOrder = async (userId, total_price, orderNumber) => {
  await appDataSource.query(
    `
    INSERT INTO orders (
        user_id,
        total_price,
        order_number
    ) VALUES (?, ?, ?);
    `,
    [userId, total_price, orderNumber]
  );

  const [{ orderId }] = await appDataSource.query(
    `SELECT LAST_INSERT_ID() AS orderId`
  );
  return orderId;
};

const orderInfoTransaction = async (
  orderId,
  ticket_option_id,
  first_name,
  last_name,
  birth,
  gender,
  mobile_number,
  email,
  ticketNumber
) => {
  return await appDataSource.transaction(async (transactionalEntityManager) => {
    await transactionalEntityManager.query(
      `INSERT INTO passengers(
        first_name,
        last_name,
        birth,
        gender,
        mobile_number,
        email
      ) VALUES (?, ?, ?, ?, ?, ?);
      `,
      [first_name, last_name, birth, gender, mobile_number, email]
    );

    const [{ passengerId }] = await transactionalEntityManager.query(
      `SELECT LAST_INSERT_ID() as passengerId`
    );

    await transactionalEntityManager.query(
      `INSERT INTO orders_tickets (
          order_id,
          ticket_option_id,
          passenger_id,
          ticket_number
      ) VALUES (?, ? , ? , ?);
      `,
      [orderId, ticket_option_id, passengerId, ticketNumber]
    );
  });
};

const getOrderInfo = async (userId) => {
  const data = await appDataSource.query(
    ` SELECT
      orders.id,
      orders.order_number,
      orders.total_price,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          "Destination", g.name,
          "Arrival", f.name
        )
      ) as Destination
    FROM
      orders
    INNER JOIN orders_tickets as b ON orders.id = b.order_id
    INNER JOIN tickets_options as c ON b.ticket_option_id = c.id
    INNER JOIN tickets as d on c.ticket_id = d.id
    INNER JOIN cities as g ON d.departure_id = g.id
    INNER JOIN cities as f ON d.arrival_id = f.id
    WHERE orders.user_id = ${userId} AND orders.order_stauts_id = 1
    GROUP BY orders.id;`
  );
  return data[0];
};

module.exports = {
  createOrder,
  orderInfoTransaction,
  getOrderInfo,
};
