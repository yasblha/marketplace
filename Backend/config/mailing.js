const axios = require('axios');
const AlertUser = require('../models/postgres_models/Alert');
const User = require('../models/postgres_models/UserPg');

class BrevoMailing {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.brevo.com/v3/smtp/email';
    this.AlertUser = AlertUser;
  }

  async sendMail(payload) {
    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendNewsletters() {
    try {
      const alertUsers = await AlertUser.findAll({
        include: [
          { model: User },
          { model: Alert, where: { alert_type: 'newsletter' } }
        ]
      });

      for (const alertUser of alertUsers) {
        const payload = {
          to: [{ email: alertUser.User.email }],
          templateId: 13, Template ,
          params: {
            subject: 'Newsletter',
            name: User.name,
            
          }
        };

        await this.sendAlert(payload);
      }

      console.log('Newsletters sent successfully');
    } catch (error) {
      console.error('Error sending newsletters:', error);
    }
  }
}

module.exports = BrevoMailing;
