const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "WorkZone";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location: Sequelize.STRING,
  };
  const config = {
    tableName: "workzones",
    timestamps: false,
  };

  const WorkZone = sequelize.define(alias, cols, config);


WorkZone.associate= function(models){

  WorkZone.hasMany(models.Professional, {
    as: "professional",
    foreignKey: "workZone_id"
  });



}

  return WorkZone;
};
