const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/postgres_models/UserPg');
const authRoutes = require('../routes/api/auth');
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

jest.mock('../models/postgres_models/UserPg');

describe('Auth Controller', () => {
    let server;

    beforeAll(() => {
        server = app.listen(3001, () => {
            console.log('Test server running on port 3001');
        });
    });

    afterAll(() => {
        server.close(() => {
            console.log('Test server closed');
        });
    });

    it('should register a new user', async () => {
        const newUser = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@example.com',
            password: 'password',
            role: 'user',
            newsletter: true,
        };

        User.create.mockResolvedValue(newUser);

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password',
                password_confirm: 'password',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user',
                newsletter: true,
            })
            .expect(201);

        expect(res.body.user).toEqual(newUser);
    });

    it('should login a user', async () => {
        const user = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password', 10),
            role: 'user',
        };

        User.findOne.mockResolvedValue(user);
        jwt.sign = jest.fn().mockImplementation(() => 'token');

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200);

        expect(res.body.accessToken).toEqual('token');
        expect(res.body.refreshToken).toEqual('token');
    });
});
