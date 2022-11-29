-- migrate:up
CREATE TABLE cabin_types (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(20) NOT NULL
);

CREATE TABLE tickets_options (
  id int PRIMARY KEY AUTO_INCREMENT,
  ticket_id int NOT NULL,
  cabin_types_id int NOT NULL,
  price decimal(10,2) NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets (id),
  FOREIGN KEY (cabin_types_id) REFERENCES cabin_types (id)
);


-- migrate:down
DROP TABLE cabin_types;
DROP TABLE tickets_options;
