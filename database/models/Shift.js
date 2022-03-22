const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "Shift";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    shift: Sequelize.STRING,
  };
  const config = {
    tableName: "shifts",
    timestamps: false,
  };

  const Shift = sequelize.define(alias, cols, config);

  Shift.associate = function (models) {
    Shift.hasMany(models.ProfessionalWorkDayShift, {
      as: "professionalsDayAndShift", //nombre de la asociación

      foreignKey: "shift_id", //lo q pide la otra tabla

      timestamps: false,
    });
  };

  return Shift;
};
