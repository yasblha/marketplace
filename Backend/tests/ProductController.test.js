const request = require('supertest');
const app = require('../server'); // Ensure correct path to server file
const sequelize = require('../config/postgres'); // Ensure correct path

describe('Product Controller', () => {
    let testServer;

    beforeAll(async () => {
        await sequelize.sync(); // Ensure the database is synchronized
        testServer = app.listen(3002, () => {
            console.log('Test server running on port 3002');
        });
    });

    afterAll((done) => {
        testServer.close(() => {
            console.log('Test server closed');
            done();
        });
    });

    it('should get all products', async () => {
        const res = await request(testServer)
            .get('/api/products')
            .expect(200);

        expect(res.body).toHaveProperty('sqlProducts');
        expect(res.body).toHaveProperty('mongoProducts');
    });

    it('should get a product by ID', async () => {
        const productId = '1'; // Use a valid MongoDB ObjectId
        const res = await request(testServer)
            .get(`/api/products/${productId}`)
            .expect(200);

        expect(res.body).toHaveProperty('id', productId);
    });
});
