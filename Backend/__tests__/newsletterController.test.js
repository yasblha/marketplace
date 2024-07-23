process.env.TEST_PORT = 4000; // Choisissez un port libre différent pour chaque test

const request = require('supertest');
const { app, closeServer } = require('../server');
const { User } = require('../models/mongo_models/User');
const { sendNewProductEmail } = require('../services/mailer');

jest.mock('../models/mongo_models/User');
jest.mock('../services/mailer');

describe('newsletterController', () => {
  afterAll(() => {
    closeServer();
  });

  beforeEach(() => {
    User.findOneAndUpdate.mockClear();
    sendNewProductEmail.mockClear();
  });

  it('should subscribe user to newsletter', async () => {
    User.findOneAndUpdate.mockResolvedValue({ email: 'test@example.com', subscribedToNewsletter: true });
    sendNewProductEmail.mockResolvedValue();

    const response = await request(app)
      .post('/api/newsletter/subscribe')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfully subscribed to newsletter.');
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      { $set: { subscribedToNewsletter: true } },
      { new: true, upsert: true }
    );
    expect(sendNewProductEmail).toHaveBeenCalledWith('test@example.com', { name: 'Subscription to Newsletter' });
  });
});
