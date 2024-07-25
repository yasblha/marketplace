const axios = require('axios');
const Alert = require('../models/postgres_models/Alert');
const User = require('../models/postgres_models/Userpg');

class BrevoMailing {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.brevo.com/v3/smtp/email';
    this.Alert = Alert;
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
      const alerts = await Alert.findAll({
        where: { alert_type: 'newsletter' },
        include: [{ model: User }]
      });

      for (const alert of alerts) {
        const payload = {
          to: [{ email: alert.User.email }],
          templateId: 13, // Adjust the template ID as necessary
          params: {
            subject: 'Newsletter',
            name: alert.User.name,
          }
        };

        await this.sendMail(payload);
      }

      console.log('Newsletters sent successfully');
    } catch (error) {
      console.error('Error sending newsletters:', error);
    }
  }
}

module.exports = BrevoMailing;