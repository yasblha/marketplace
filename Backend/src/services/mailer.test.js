jest.mock('./transporter', () => ({
    sendMail: jest.fn().mockResolvedValue({ response: '250 Message accepted' })
  }));
  
  const sendEmail = require('./mailer');
  
  describe('sendEmail function', () => {
    it('should send an email with correct parameters', async () => {
      const to = 'iouahabi1@myges.fr';
      const subject = 'Test Email';
      const text = 'This is a test email.';
      const response = await sendEmail(to, subject, text);
  
      expect(require('./transporter').sendMail).toHaveBeenCalled();
      expect(require('./transporter').sendMail).toHaveBeenCalledWith({
        from: 'ibrahim60200@gmail.com',
        to: to,
        subject: subject,
        text: text
      });
  
      expect(response.response).toBe('250 Message accepted');
    });
  });
  