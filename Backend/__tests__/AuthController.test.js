const request = require('supertest');
const { app } = require('../server');
const { User } = require('../models/postgres_models/UserPg');

jest.mock('../models/postgres_models/UserPg');

describe('AuthController', () => {
  beforeEach(() => {
    User.getUserByEmail.mockClear();
  });

  it('should register a new user', async () => {
    User.createUser = jest.fn().mockResolvedValue({
      id: 1,
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        role: 'user',
        email: 'test@example.com',
        lastName: 'User',
        firstName: 'Test',
        password: 'password',
        password_confirm: 'password',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur créé avec succès');
  });

  it('should return error if passwords do not match', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        role: 'user',
        email: 'test@example.com',
        lastName: 'User',
        firstName: 'Test',
        password: 'password',
        password_confirm: 'wrongpassword',
      });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('Les mots de passe ne correspondent pas');
  });
});
