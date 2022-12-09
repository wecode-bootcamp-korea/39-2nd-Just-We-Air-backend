const { appDataSource } = require("./dataSource");

const ticketInfo = async (email) => {
  const ticket = await appDataSource.query(
    `
    SELECT
        passengers.first_name,
        passengers.last_name,
        passengers.mobile_number,
        tickets.departure_date,
        A.name as departure,
        tickets.arrival_date,
        B.name as arrival,
        tickets.flight_number
    FROM passengers
    INNER JOIN orders_tickets ON orders_tickets.passenger_id = passengers.id
    INNER JOIN tickets_options ON tickets_options.id = orders_tickets.ticket_option_id
    INNER JOIN tickets ON tickets.id = tickets_options.ticket_id
    INNER JOIN cities as A ON tickets.departure_id = A.id
    INNER JOIN cities as B ON tickets.arrival_id = B.id
    WHERE passengers.email = ?`,
    [email]
  );
  return ticket[0];
};

module.exports = {
  ticketInfo,
};
