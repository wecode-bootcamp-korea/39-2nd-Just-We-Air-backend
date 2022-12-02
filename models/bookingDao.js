const { appDataSource } = require("./dataSource");

const getCities = async () => {
  const selectCities = await appDataSource.query(`
  SELECT 
  countries.id country_id, countries.name, 
  (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", cities.id, "name", cities.name)) FROM cities WHERE countries.id = cities.country_id) cities
  FROM countries
  `);
  return selectCities;
};

const searchFlight = async (date, departureId, arrivalId) => {
  const flightList = await appDataSource.query(
    `
  SELECT
    t.id as tickets_id,
    t.departure_date,
    t.arrival_date,
    t.flight_number,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "ticket_option_id",
                    tickets_options.id,
                    "cabin_type",
                    cabin_types.name,
                    "price",
                    tickets_options.price
                )
            )
        from
            tickets_options
            left join cabin_types ON cabin_types.id = tickets_options.cabin_types_id
            left join tickets on tickets.id = t.id
            where tickets_options.ticket_id = tickets.id
    ) as tickets_options
FROM
    tickets as t
    left join tickets_options as t_o on t.id = t_o.ticket_id
    left join cabin_types as c_t on c_t.id = t_o.cabin_types_id
where
    t.departure_id = ?
    and t.arrival_id = ?
    and date(departure_date) = ?
GROUP by
    t.id
  `,
    [departureId, arrivalId, date]
  );

  return flightList;
};

module.exports = { getCities, searchFlight };
