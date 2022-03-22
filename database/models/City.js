const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "City";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    province: Sequelize.STRING,
    district: Sequelize.STRING,
  };
  const config = {
    tableName: "cities",
    timestamps: false,
  };

  const City = sequelize.define(alias, cols, config);

  City.associate = function(models){

    City.hasMany(models.Client, {
      as: "clients",
      foreignKey: "city_Id"
    });





  };



  return City;
};
