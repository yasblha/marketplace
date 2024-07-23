const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const DataTypes = SequelizeMock.DataTypes;
dbMock.DataTypes = DataTypes;

class Sequelize {
  constructor() {
    return dbMock;
  }
}

Sequelize.DataTypes = DataTypes;
module.exports = { Sequelize, DataTypes };
