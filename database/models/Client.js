const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "Client";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    dni: Sequelize.INTEGER,
    mobile: Sequelize.BIGINT,
    avatar: Sequelize.STRING,
    password: Sequelize.STRING,
    address: Sequelize.STRING,
    city_Id: Sequelize.STRING,
    cart_Id: Sequelize.STRING,
    role: Sequelize.STRING,
  };
  const config = {
    tableName: "clients",
    timestamps: false,
  };

  const Client = sequelize.define(alias, cols, config);

  Client.associate = function (models) {
    //Consultar con Pablo
    Client.hasOne(models.Professional, {
      as: "profesionals",
      foreignKey: "client_id", // lo q pide la otra tabla
    });

    Client.belongsTo(models.City, {
      as: "cities",
      foreignKey: "city_Id",
    });
  };
  return Client;
};
