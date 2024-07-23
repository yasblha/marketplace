const request = require('supertest');
const { app } = require('../server');
const { User } = require('../models/mongo_models/User');
const { sendPromotionEmail } = require('../services/mailer');

jest.mock('../models/mongo_model/User');
jest.mock('../services/mailer');

describe('promotionController', () => {
  beforeEach(() => {
    User.find.mockClear();
    sendPromotionEmail.mockClear();
  });

  it('should notify promotion subscribers', async () => {
    User.find.mockResolvedValue([{ email: 'test@example.com', alerts: { promotion: true } }]);
    sendPromotionEmail.mockResolvedValue();

    const promotionDetails = { title: 'New Promotion', discount: 20 };
    await promotionController.notifyPromotionSubscribers(promotionDetails);

    expect(User.find).toHaveBeenCalledWith({ 'alerts.promotion': true });
    expect(sendPromotionEmail).toHaveBeenCalledWith('test@example.com', promotionDetails);
  });
});
