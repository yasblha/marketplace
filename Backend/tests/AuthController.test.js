const request = require('supertest');
const { app, closeServer } = require('../server');
const mongoose = require('mongoose');
const User = require('../models/mongo_models/User');

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Connectez-vous à la base de données de test
    const MONGO_URI = 'mongodb://localhost:27017/test_marketplace';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    // Déconnectez-vous de la base de données de test
    await mongoose.connection.close();
    closeServer();
  });

  afterEach(async () => {
    // Nettoyez la base de données après chaque test
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const newUser = {
      role: 'user',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'Password123!',
      password_confirm: 'Password123!',
      newsletter: true,
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser)
      .expect(201);

    expect(res.body.message).toBe('Utilisateur enregistré avec succès');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeTruthy();
    expect(user.newsletter).toBe(true);
  });

  it('should not register a user with mismatched passwords', async () => {
    const newUser = {
      role: 'user',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'Password123!',
      password_confirm: 'Password1234!',
      newsletter: true,
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser)
      .expect(422); // Le code HTTP 422 pour "Unprocessable Entity"

    expect(res.body.message).toBe('Les mots de passe ne correspondent pas.');
  });
});
