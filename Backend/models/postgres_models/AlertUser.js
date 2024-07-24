const { DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres");
const User = require("../postgres_models/UserPg");

const AlertUser = sequelize.define("Alert", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

AlertUser.belongsTo(User, { foreignKey: "user_id" });

module.exports = Alert;
