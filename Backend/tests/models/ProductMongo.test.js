require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../../models/mongo_models/Product');

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  const mockMongoose = jest.genMockFromModule('mongoose');
  mockMongoose.Schema = actualMongoose.Schema;
  mockMongoose.model = actualMongoose.model;
  return mockMongoose;
});

describe('Product Mongo Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new product', async () => {
    const productData = { name: 'Test Product', price: 10 };
    const product = new Product(productData);
    await product.save();
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(10);
  });

  it('should find a product by name', async () => {
    const productData = { name: 'Find Product', price: 20 };
    const product = new Product(productData);
    await product.save();
    const foundProduct = await Product.findOne({ name: 'Find Product' });
    expect(foundProduct).not.toBeNull();
    expect(foundProduct.name).toBe('Find Product');
    expect(foundProduct.price).toBe(20);
  });
});
