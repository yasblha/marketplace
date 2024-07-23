const mongoose = require('mongoose');
const ProductMongo = require('../../models/mongo_models/Product');
const ProductSQL = require('../../models/postgres_models/ProductPg');
const Media = require('../../models/postgres_models/Media');
const denormalizeProduct = require('../../services/denormalizeProduct');
require('dotenv').config();

jest.mock('mongoose');
jest.mock('../../models/mongo_models/Product', () => {
  const actualProduct = jest.requireActual('../../models/mongo_models/Product');
  return {
    ...actualProduct,
    findByIdAndUpdate: jest.fn(),
  };
});
jest.mock('../../models/postgres_models/ProductPg');
jest.mock('../../models/postgres_models/Media');

describe('denormalizeProduct', () => {
  it('should denormalize a product', async () => {
    ProductSQL.findByPk.mockResolvedValue({
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      category: 'Category',
      brand: 'Brand',
      price: 100,
      stock_available: 10,
      status: 'available',
      image: []
    });
    
    Media.findAll.mockResolvedValue([{ dataValues: { path: 'image1.jpg' } }]);
    
    ProductMongo.findByIdAndUpdate.mockResolvedValue({});

    await denormalizeProduct(1);

    expect(ProductSQL.findByPk).toHaveBeenCalledWith(1, {
      attributes: ["id", "name", "description", "category", "brand", "price", "stock_available", "status", "image"]
    });
    expect(Media.findAll).toHaveBeenCalledWith({
      where: { productId: 1 },
      attributes: ["path"]
    });
    expect(ProductMongo.findByIdAndUpdate).toHaveBeenCalledWith(
      new mongoose.Types.ObjectId('000000000000000000000001'),
      {
        _id: new mongoose.Types.ObjectId('000000000000000000000001'),
        name: 'Test Product',
        description: 'A test product',
        category: 'Category',
        brand: 'Brand',
        price: 100,
        stock_available: 10,
        status: 'available',
        images: ['image1.jpg']
      },
      { upsert: true, new: true }
    );
  });
});
