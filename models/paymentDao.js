const { appDataSource } = require("./dataSource");

const updateOrderStatus = async (orderNumber) => {
  await appDataSource.query(
    `UPDATE orders
        SET order_stauts_id = 2
        WHERE order_number = ?`,
    [orderNumber]
  );
};

module.exports = {
  updateOrderStatus,
};
