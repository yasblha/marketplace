const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/postgres_models/UserPg');
const newsletterRoutes = require('../routes/api/newsletter'); // Assurez-vous que le chemin est correct
const request = require('supertest');
const app = express();

app.use(bodyParser.json());
app.use('/api/newsletter', newsletterRoutes);

jest.mock('../models/postgres_models/UserPg');

describe('Newsletter Controller', () => {
    let server;

    beforeAll(() => {
        server = app.listen(3001, () => console.log('Test server running on port 3001'));
    });

    afterAll(() => {
        server.close(() => {
            console.log('Test server closed');
        });
    });

    it('should send promotional emails', async () => {
        const users = [{ email: 'john.doe@example.com' }];
        User.findAll.mockResolvedValue(users);

        const res = await request(app)
            .post('/api/newsletter/send')
            .expect(200);

        expect(User.findAll).toHaveBeenCalled();
    });
});
