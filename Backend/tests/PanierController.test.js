const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cartRoutes = require('../routes/api/PanierRoute');
const User = require('../models/postgres_models/UserPg');
const ProductService = require('../services/productService');
const Cart = require('../models/postgres_models/Panier');
const sequelize = require('../config/postgres');

const app = express();
app.use(bodyParser.json());
app.use('/api/panier', cartRoutes);

describe('Panier Controller', () => {
    let server;

    beforeAll(async () => {
        await sequelize.sync(); // Assurez-vous que la base de données est synchronisée
        server = app.listen(3002, () => {
            console.log('Test server running on port 3002');
        });
    }, 60000); // Augmentez le délai d'attente si nécessaire

    afterAll((done) => {
        server.close(() => {
            console.log('Test server closed');
            done();
        });
    });

    it('should create a cart item', async () => {
        const client = { id: 1, name: 'Client' };
        const product = { id: 1, name: 'Product' };
        const cartItem = { id: 1, userid: client.id, productid: product.id, quantity: 1 };

        jest.spyOn(User, 'findByPk').mockResolvedValue(client);
        jest.spyOn(ProductService, 'getProductById').mockResolvedValue(product);
        jest.spyOn(Cart, 'create').mockResolvedValue(cartItem);

        const res = await request(app)
            .post('/api/panier')
            .send({ userid: client.id, productid: product.id, quantity: 1 })
            .expect(201);

        expect(res.body).toEqual(cartItem);
    });

    it('should get cart items for a user', async () => {
        const client = { id: 1, name: 'Client' };
        const cartItems = [
            { id: 1, userid: client.id, productid: 1, quantity: 1 },
            { id: 2, userid: client.id, productid: 2, quantity: 2 }
        ];

        jest.spyOn(Cart, 'findAll').mockResolvedValue(cartItems);

        const res = await request(app)
            .get(`/api/panier/${client.id}`)
            .expect(200);

        expect(res.body).toEqual(cartItems);
    });

    it('should update a cart item', async () => {
        const cartItem = { id: 1, userid: 1, productid: 1, quantity: 1 };
        const updatedCartItem = { ...cartItem, quantity: 2 };

        jest.spyOn(Cart, 'findOne').mockResolvedValue({
            ...cartItem,
            update: jest.fn().mockResolvedValue(updatedCartItem)
        });

        const res = await request(app)
            .put(`/api/panier/${cartItem.id}`)
            .send({ quantity: 2 })
            .expect(200);

        expect(res.body).toEqual(updatedCartItem);
    });

    it('should delete a cart item', async () => {
        const cartItem = { id: 1, userid: 1, productid: 1, quantity: 1 };

        jest.spyOn(Cart, 'findOne').mockResolvedValue({
            ...cartItem,
            destroy: jest.fn().mockResolvedValue(null)
        });

        const res = await request(app)
            .delete(`/api/panier/${cartItem.id}`)
            .expect(200);

        expect(res.body).toEqual({});
    });
});
