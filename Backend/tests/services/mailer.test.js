const nodemailer = require('nodemailer');
const { sendEmail } = require('../../services/mailer');

jest.mock('nodemailer');

describe('Mailer', () => {
  it('should send an email', async () => {
    const sendMailMock = nodemailer.createTransport().sendMail;

    const to = 'iouahabi1@myges.fr';
    const subject = 'Test Email';
    const htmlContent = '<p>This is a test email</p>';

    await sendEmail(to, subject, htmlContent);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'yassineboul98@gmail.com',
      to,
      subject,
      html: htmlContent,
    });
  });
});

