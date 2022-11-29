-- migrate:up
CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT,
  kakao_id bigint,
  first_name varchar(20) NOT NULL,
  last_name varchar(20) NOT NULL,
  birth datetime NOT NULL,
  mobile_number varchar(30) NOT NULL,
  email varchar(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);


-- migrate:down
DROP TABLE users;
