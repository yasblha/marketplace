const request = require('supertest');
const { app, server, sequelize } = require('../server'); // Importer l'application et le serveur exportés par server.js
const User = require('../models/postgres_models/UserPg'); // Utilisez le bon modèle utilisateur
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.setTimeout(90000); // Augmenter le timeout global pour les tests Jest

describe('Auth Controller', () => {
    let testServer;

    beforeAll(async (done) => {
        await sequelize.sync(); // Assurez-vous que la base de données est synchronisée
        testServer = app.listen(3002, () => {
            console.log('Test server running on port 3002');
            done();
        });
    });

    afterAll((done) => {
        testServer.close(() => {
            console.log('Test server closed');
            done();
        });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const newUser = {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
                newsletter: false,
                confirmed: false,
            };

            jest.spyOn(User, 'create').mockResolvedValue({
                ...newUser,
                id: 1,
                confirmed: false,
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser)
                .expect(201);

            expect(res.body).toEqual({
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                role: 'user',
                newsletter: false,
                confirmed: false,
            });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a user', async () => {
            const user = {
                id: 1,
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'user',
                newsletter: false,
                confirmed: true,
            };

            jest.spyOn(User, 'findOne').mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(jwt, 'sign').mockImplementation(() => 'token');

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john.doe@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(res.body).toEqual({
                accessToken: 'token',
                refreshToken: 'token',
                message: 'Bonjour ! Votre utilisateur est connecté',
                user: {
                    id: 1,
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john.doe@example.com',
                    role: 'user',
                    newsletter: false,
                    confirmed: true,
                },
            });
        });
    });
});
