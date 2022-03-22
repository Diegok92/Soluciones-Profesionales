const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "WorkDay";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    day: Sequelize.STRING,
  };
  const config = {
    tableName: "workdays",
    timestamps: false,
  };

  const WorkDay = sequelize.define(alias, cols, config);

  WorkDay.associate = function (models) {
    WorkDay.hasMany(models.ProfessionalWorkDayShift, {
      as: "professionalsDayAndShift", //nombre de la asociación

      foreignKey: "workDay_id", //lo q toma la tabla

      timestamps: false,
    });
  };

  return WorkDay;
};
