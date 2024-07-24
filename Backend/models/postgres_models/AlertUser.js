const { DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres");
const User = require("../postgres_models/UserPg");

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
  // mail: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});

AlertUser.belongsTo(User, { foreignKey: "userId" });

module.exports = AlertUser;
