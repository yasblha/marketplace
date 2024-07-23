const axios = require('axios');
const brevoMailingConfig = require('./brevoConfig');

class BrevoMailing {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.brevo.com/v3/smtp/email';
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
}

module.exports = BrevoMailing;
