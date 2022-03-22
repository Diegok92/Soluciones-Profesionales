const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const alias = "WorkImage";
  const cols = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageTitle: Sequelize.STRING,
    
  };
  const config = {
    tableName: "workimages",
    timestamps: false,
  };

  const WorkImage = sequelize.define(alias, cols, config);

  WorkImage.associate= function(models){

  WorkImage.hasOne(models.Professional, {
    as: "workImages",
    foreignKey: "workImage_id"
  });

}

  return WorkImage;
};
