const { DataTypes } = require("sequelize");
const sequelize = require("../../config/postgres");
const User = require("../postgres_models/UserPg");


const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  alert_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.STRING, // Assuming productId is a string from MongoDB
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Alert', // Explicitly specify the table name
  timestamps: false, // Disable automatic timestamp fields

});

Alert.belongsTo(User, { foreignKey: "userId" });



module.exports = Alert;