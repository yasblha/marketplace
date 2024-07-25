const { DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres");
const User = require("../postgres_models/UserPg");


const Alert = sequelize.define("Alert", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  alert_type: { // stock ou newsletter
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
});

Alert.belongsTo(User, { foreignKey: "userId" });



module.exports = Alert;
