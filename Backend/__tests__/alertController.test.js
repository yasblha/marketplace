// const request = require('supertest');
// const { app } = require('../server');
const { User } = require('../models/mongo_models/User'); // Chemin correct vers User.js
const { sendAlertEmail } = require('../services/mailer'); // Chemin correct vers mailer.js

jest.mock('../models/mongo_models/User');
jest.mock('../services/mailer');

describe('alertController', () => {
  beforeEach(() => {
    User.findOneAndUpdate.mockClear();
    sendAlertEmail.mockClear();
  });

  it('should subscribe to alerts', async () => {
    User.findOneAndUpdate.mockResolvedValue({ email: 'test@example.com', alerts: { promotion: true } });
    sendAlertEmail.mockResolvedValue();

    const response = await request(app)
      .post('/api/alerts/subscribe')
      .send({ email: 'test@example.com', alertType: 'promotion' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Subscribed to promotion successfully.');
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      { $set: { 'alerts.promotion': true } },
      { new: true, upsert: true }
    );
    expect(sendAlertEmail).toHaveBeenCalledWith('test@example.com', 'promotion');
  });
});
