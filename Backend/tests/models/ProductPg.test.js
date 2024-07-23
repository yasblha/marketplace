require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
const Product = require('../../models/postgres_models/ProductPg');

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

describe('Product Postgres Model', () => {
  it('should create a new product', async () => {
    const productData = { name: 'Test Product', price: 10 };
    const product = await Product.create(productData);
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(10);
  });

  it('should find a product by name', async () => {
    const productData = { name: 'Find Product', price: 20 };
    const product = await Product.create(productData);
    const foundProduct = await Product.findOne({ where: { name: 'Find Product' } });
    expect(foundProduct).not.toBeNull();
    expect(foundProduct.name).toBe('Find Product');
    expect(foundProduct.price).toBe(20);
  });
});
