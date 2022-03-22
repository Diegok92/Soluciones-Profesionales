const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "ProfessionalWorkDayShift";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  };
  const config = {
    tableName: "professionals_workdays",
    timestamps: false,
  };

  const ProfessionalWorkDayShift = sequelize.define(alias, cols, config);

  ProfessionalWorkDayShift.associate = function (models) {
    ProfessionalWorkDayShift.belongsTo(models.WorkDay, {
      as: "workDays", //nombre de la asociación
      foreignKey: "workDay_id",
      timestamps: false,
    });

    ProfessionalWorkDayShift.belongsTo(models.Shift, {
      as: "shifts", //nombre de la asociación
      foreignKey: "shift_id",
      timestamps: false,
    });

    ProfessionalWorkDayShift.belongsTo(models.Professional, {
      as: "professionals", //nombre de la asociación
      foreignKey: "professional_id",
      timestamps: false,
    });
  };

  return ProfessionalWorkDayShift;
};
