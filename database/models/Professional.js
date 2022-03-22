const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "Professional";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emergency: Sequelize.INTEGER, //si no anda pasarlo a string (mokaroo da 1/0)
    whyMe: Sequelize.TEXT,
    price: Sequelize.STRING,
    cbu: Sequelize.STRING,
    licence: Sequelize.STRING,
    client_id: Sequelize.INTEGER,
    workZone_id: Sequelize.INTEGER,
    workImage_id: Sequelize.INTEGER,
  };
  const config = {
    tableName: "professional",
    timestamps: false,
  };

  const Professional = sequelize.define(alias, cols, config);

  Professional.associate = function (models) {
    Professional.belongsToMany(models.Profession, {
      as: "professions", //nombre de la asociación
      through: "professionals_profession",
      foreignKey: "professional_id",
      otherKey: "profession_id",
      timestamps: false,
    });

    Professional.belongsTo(models.Client, {
      as: "clients",
      foreignKey: "client_id",
    });

    Professional.belongsTo(models.WorkImage, {
      as: "workImages",
      foreignKey: "workImage_id",
    });

    Professional.belongsTo(models.WorkZone, {
      // REVISAR SI NO ES HASMANY
      as: "workZones",
      foreignKey: "workZone_id",
    });

    Professional.hasMany(models.ProfessionalWorkDayShift, {
      as: "ProfessionalWorkDayShift", //nombre de la asociación
      foreignKey: "professional_id",
      timestamps: false,
    });
  };

  return Professional;
};
