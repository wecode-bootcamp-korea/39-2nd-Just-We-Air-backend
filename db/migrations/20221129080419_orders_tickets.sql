-- migrate:up
CREATE TABLE passengers (
  id int PRIMARY KEY AUTO_INCREMENT,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  birth datetime NOT NULL,
  gender varchar(10) NOT NULL,
  nationality varchar(50) NOT NULL,
  mobile_number varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  passport_number varchar(500) NULL
);


CREATE TABLE orders_tickets (
  id int PRIMARY KEY AUTO_INCREMENT,
  order_id int NOT NULL,
  ticket_option_id int NOT NULL,
  passenger_id int NOT NULL,
  ticket_number varchar(500) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (ticket_option_id) REFERENCES tickets_options (id),
  FOREIGN KEY (passenger_id) REFERENCES passengers (id)
);

-- migrate:down
DROP TABLE passengers;
DROP TABLE orders_tickets;
