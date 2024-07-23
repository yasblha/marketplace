require('dotenv').config();
const { Sequelize } = require('sequelize');

jest.mock('sequelize', () => {
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
  return { Sequelize, DataTypes };
});

describe('Postgres Config', () => {
  it('should connect to PostgreSQL', async () => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });

    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  });
});
