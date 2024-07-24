const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/postgres_models/UserPg');
const jwt = require('jsonwebtoken');
const authRoutes = require('../routes/api/auth'); // Assurez-vous que cette route est correcte

jest.mock('../models/postgres_models/UserPg');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
    let server;

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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/auth/register should register a new user', async () => {
        const newUser = {
            firstname: 'Test',
            lastname: 'User',
            email: 'test@example.com',
            password: 'password',
            role: 'user',
            newsletter: true,
        };

        User.createUser.mockResolvedValue({
            ...newUser,
            id: 1,
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send(newUser)
            .expect(201);

        expect(res.body).toEqual(expect.objectContaining({
            firstname: 'Test',
            lastname: 'User',
            email: 'test@example.com',
            role: 'user',
            newsletter: true,
        }));
    });

    test('POST /api/auth/login should login a user', async () => {
        const user = {
            id: 1,
            email: 'test@example.com',
            password: 'password',
            role: 'user',
        };

        User.getUserByEmail.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockImplementation(() => 'token');

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200);

        expect(res.body.token).toEqual('token');
    });
});
