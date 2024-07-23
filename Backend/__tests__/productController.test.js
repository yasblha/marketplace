const request = require('supertest');
const { app } = require('../server');
const ProductService = require('../services/productService');

jest.mock('../services/productService');

describe('productController', () => {
  beforeEach(() => {
    ProductService.getProducts.mockClear();
  });

  it('should get all products', async () => {
    ProductService.getProducts.mockResolvedValue([{ id: 1, name: 'Test Product' }]);

    const response = await request(app)
      .get('/api/products')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([{ id: 1, name: 'Test Product' }]));
  });
});
