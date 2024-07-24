const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/postgres_models/UserPg');
const ProductService = require('../services/productService');
const Cart = require('../models/postgres_models/Panier');
const panierRoutes = require('../routes/api/PanierRoute'); // Assurez-vous que le chemin est correct
const request = require('supertest');
const app = express();

app.use(bodyParser.json());
app.use('/api/panier', panierRoutes);

jest.mock('../models/postgres_models/UserPg');
jest.mock('../services/productService');
jest.mock('../models/postgres_models/Panier');

describe('Panier Controller', () => {
    let server;

    beforeAll(() => {
        server = app.listen(3001, () => console.log('Test server running on port 3001'));
    });

    afterAll(() => {
        server.close(() => {
            console.log('Test server closed');
        });
    });

    it('should create a cart item', async () => {
        const client = { id: 1, email: 'john.doe@example.com' };
        const product = { id: 1, stock_available: 100 };
        const cartItem = { id: 1, userid: client.id, productid: product.id, quantity: 1 };

        User.findByPk.mockResolvedValue(client);
        ProductService.getProductById.mockResolvedValue(product);
        Cart.create.mockResolvedValue(cartItem);

        const res = await request(app)
            .post('/api/panier')
            .send({ userid: client.id, productid: product.id, quantity: 1 })
            .expect(201);

        expect(res.body).toEqual(cartItem);
        expect(User.findByPk).toHaveBeenCalledWith(client.id);
        expect(ProductService.getProductById).toHaveBeenCalledWith(product.id);
        expect(Cart.create).toHaveBeenCalledWith(expect.objectContaining(cartItem));
    });
});
