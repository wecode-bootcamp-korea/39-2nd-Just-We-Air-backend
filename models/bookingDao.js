const { appDataSource } = require("./dataSource");

const getcities = async () => {
  const selectCities = await appDataSource.query(`
  SELECT 
  countries.id country_id, countries.name, 
  (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", cities.id, "name", cities.name)) FROM cities WHERE countries.id = cities.country_id) cities
  FROM countries
  `);
  return selectCities;
};

module.exports = { getcities };
