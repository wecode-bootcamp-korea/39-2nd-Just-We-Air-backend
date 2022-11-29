-- migrate:up
CREATE TABLE countries (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(20) NOT NULL
);

CREATE TABLE cities (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  country_id int NOT NULL,
  FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE tickets (
  id int PRIMARY KEY AUTO_INCREMENT,
  departure_id int NOT NULL,
  departure_date datetime NOT NULL,
  arrival_id int NOT NULL,
  arrival_date datetime NOT NULL,
  flight_number varchar(50) NOT NULL,
  FOREIGN KEY (departure_id) REFERENCES cities (id),
  FOREIGN KEY (arrival_id) REFERENCES cities (id)
);

-- migrate:down
DROP TABLE countries;
DROP TABLE cities;
DROP TABLE tickets;
