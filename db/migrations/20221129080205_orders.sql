-- migrate:up
CREATE TABLE order_stauts (
  id int PRIMARY KEY AUTO_INCREMENT,
  status varchar(100) NOT NULL
);

CREATE TABLE orders (
  id int PRIMARY KEY AUTO_INCREMENT,
  user_id int NOT NULL,
  order_stauts_id int NULL,
  order_number varchar(500) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (order_stauts_id) REFERENCES order_stauts (id)
);

-- migrate:down
DROP TABLE order_stauts;
DROP TABLE orders;