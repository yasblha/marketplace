require('dotenv').config();
const ProductService = require('../../services/productService');
const ProductSQL = require('../../models/postgres_models/ProductPg');
const ProductMongo = require('../../models/mongo_models/Product');
const denormalizeProduct = require('../../services/denormalizeProduct');

jest.mock('../../models/postgres_models/ProductPg');
jest.mock('../../models/mongo_models/Product');
jest.mock('../../services/denormalizeProduct');
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

describe('ProductService', () => {
  it('should get products', async () => {
    ProductSQL.getProducts.mockResolvedValue([]);
    ProductMongo.find.mockResolvedValue([]);

    const result = await ProductService.getProducts();
    
    expect(result.sqlProducts).toEqual([]);
    expect(result.mongoProducts).toEqual([]);
  });

  it('should create a product', async () => {
    const productData = { name: 'New Product' };
    ProductSQL.createProduct.mockResolvedValue({ id: 1, ...productData });
    denormalizeProduct.mockResolvedValue();

    const result = await ProductService.createProduct(productData);
    
    expect(result.newSQLProduct).toEqual({ id: 1, name: 'New Product' });
    expect(ProductSQL.createProduct).toHaveBeenCalledWith(productData);
    expect(denormalizeProduct).toHaveBeenCalledWith(1);
  });

  // Ajoutez d'autres tests pour les méthodes restantes
});
