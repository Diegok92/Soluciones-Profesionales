const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "Cart";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    professional_id: Sequelize.STRING,
    client_id: Sequelize.STRING,
    reservedDay: Sequelize.STRING,
    reservedShift: Sequelize.STRING,
    totalPrice: Sequelize.STRING,
  };
  const config = {
    tableName: "carts",
    timestamps: false,
  };

  const Cart = sequelize.define(alias, cols, config);

  return Cart;
};
