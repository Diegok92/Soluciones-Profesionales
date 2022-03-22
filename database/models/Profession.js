const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "Profession";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    profession: Sequelize.STRING,
  };
  const config = {
    tableName: "professions",
    timestamps: false,
  };

  const Profession = sequelize.define(alias, cols, config);

  Profession.associate = function (models) {
    Profession.belongsToMany(models.Professional, {
      as: "professionals", //nombre de la asociación
      through: "professionals_profession",
      foreignKey: "profession_id",
      otherKey: "professional_id",
      timestamps: false,
    });
    // Profession.belongsTo(models.professionals_profession, {
    //   as: "professionals_profession_title",
    //   foreignKey: "professional_id",
    // });
  };

  return Profession;
};
