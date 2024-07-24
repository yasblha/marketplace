const { DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres");


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
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});



module.exports = Alert;
