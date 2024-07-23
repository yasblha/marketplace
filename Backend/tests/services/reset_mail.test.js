const User = require('../../models/postgres_models/UserPg');
const { sendEmail } = require('../../services/mailer');
const { checkPasswordRenewal } = require('../../services/reset_mail');
require('dotenv').config();


jest.mock('../../models/postgres_models/UserPg');
jest.mock('../../services/mailer');

describe('checkPasswordRenewal', () => {
  it('should send password reset emails', async () => {
    User.findAll.mockResolvedValue([
      {
        email: 'iouahabi1@myges.fr',
        account_created_at: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000), // 70 days ago
        password_last_changed: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000), // 70 days ago
        reset_token: 'reset-token',
        firstname: 'John'
      }
    ]);
    sendEmail.mockResolvedValue();

    await checkPasswordRenewal();

    expect(sendEmail).toHaveBeenCalled();
    expect(sendEmail.mock.calls[0][0]).toBe('iouahabi1@myges.fr');
    expect(sendEmail.mock.calls[0][1]).toBe('Réinitialisation de votre mot de passe');
  });

  // Ajoutez d'autres tests pour les cas de renouvellement de mot de passe
});
