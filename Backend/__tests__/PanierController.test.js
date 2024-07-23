const request = require('supertest');
const { app } = require('../server');
const { Cart } = require('../models/postgres_models/Panier');
const { Client } = require('../models/postgres_models/UserPg');
const { Product } = require('../models/mongo_models/Product');

jest.mock('../models/postgres_models/Panier');
jest.mock('../models/postgres_models/Userpg');
jest.mock('../models/mongo_models/Product');

describe('PanierController', () => {
  beforeEach(() => {
    Cart.create.mockClear();
    Client.findByPk.mockClear();
    Product.findById.mockClear();
  });

  it('should create a cart item', async () => {
    Client.findByPk.mockResolvedValue({ id: 1, name: 'Test Client' });
    Product.findById.mockResolvedValue({ id: 1, name: 'Test Product' });
    Cart.create.mockResolvedValue({ id: 1, userid: 1, productid: 1, quantity: 2 });

    const response = await request(app)
      .post('/api/panier')
      .send({ userid: 1, productid: 1, quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({ userid: 1, productid: 1, quantity: 2 }));
  });
});
