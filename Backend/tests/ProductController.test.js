const express = require('express');
const bodyParser = require('body-parser');
const ProductService = require('../services/productService');
const productRoutes = require('../routes/api/products'); // Assurez-vous que le chemin est correct
const request = require('supertest');
const app = express();

app.use(bodyParser.json());
app.use('/api/products', productRoutes);

jest.mock('../services/productService');

describe('Product Controller', () => {
    let server;

    beforeAll(() => {
        server = app.listen(3001, () => console.log('Test server running on port 3001'));
    });

    afterAll(() => {
        server.close(() => {
            console.log('Test server closed');
        });
    });

    it('should get all products', async () => {
        const products = [{ id: 1, name: 'Product 1' }];
        ProductService.getProducts.mockResolvedValue(products);

        const res = await request(app)
            .get('/api/products')
            .expect(200);

        expect(res.body).toEqual(products);
    });
});
