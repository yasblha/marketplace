const { DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres");
const User = require("../postgres_models/UserPg");
const Alert = require("../postgres_models/Alert");
const { user } = require("../../controllers/AuthController");

const AlertUser = sequelize.define("Alert", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
 alertId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // mail: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});

AlertUser.belongsTo(User, { foreignKey: "userId" });
AlertUser.belongsTo(Alert, { foreignKey: "alertId" });

module.exports = AlertUser;
