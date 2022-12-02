-- migrate:up
ALTER TABLE passengers
DROP INDEX UC_Passenger,
ADD UNIQUE INDEX UC_Passenger (email) USING BTREE;

-- migrate:down

