const request = require('supertest');
const app = require('../../server'); 
require('dotenv').config();

jest.mock('mongoose', () => require('../__mocks__/mongoose'));
jest.mock('sequelize', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  const DataTypes = SequelizeMock.DataTypes;
  
  dbMock.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    brand: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    stock_available: DataTypes.INTEGER,
    status: DataTypes.STRING,
    image: DataTypes.ARRAY(DataTypes.STRING),
  });

  dbMock.DataTypes = DataTypes;
  return dbMock;
});

describe.only('ProductController', () => {
  it('should get all products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Ajoutez d'autres tests pour ProductController ici
});
