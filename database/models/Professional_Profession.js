const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "professionals_profession";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    professional_id: Sequelize.STRING,
    profession_id: Sequelize.STRING,
  };
  const config = {
    tableName: "professionals_profession",
    timestamps: false,
  };

  const Professional_Professional = sequelize.define(alias, cols, config);

  // professionals_profession.associate = function (models) {
  //   professionals_profession.hasMany(models.Profession, {
  //     as: "professionals_profession_title", //nombre de la asociación
  //     foreignKey: "professional_id",
  //     timestamps: false,
  //   });
  // };

  return Professional_Professional;
};
