const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/mongo_models/User'); 
const newsletterRoutes = require('../routes/api/newsletter');

jest.mock('../models/mongo_models/User'); 

const app = express();
app.use(bodyParser.json());
app.use('/api/newsletter', newsletterRoutes);

let server;

describe('Newsletter Controller', () => {
    beforeAll((done) => {
        server = app.listen(3001, () => {
            console.log('Test server running on port 3001');
            done();
        });
    });

    afterAll((done) => {
        server.close(() => {
            console.log('Test server closed');
            done();
        });
    });

    it('should send promotional emails', async () => {
        const users = [{ email: 'john.doe@example.com' }];

        jest.spyOn(User, 'find').mockResolvedValue(users); 
        
        const res = await request(app)
            .post('/api/newsletter/send-promotions')
            .expect(200);

        expect(res.body.message).toBe('Les emails promotionnels ont été envoyés avec succès.');
    });
});
