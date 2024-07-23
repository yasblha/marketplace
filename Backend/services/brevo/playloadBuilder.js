const brevoMailingConfig = require('./brevoConfig');
const { User } = require('../../models/postgres_models/UserPg'); // Assuming User model is defined in models

class PayloadBuilder {
  static async build(eventType, userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const config = brevoMailingConfig[eventType];
    if (!config) {
      throw new Error('Invalid event type');
    }

    const emailConfig = config[0]; // Assuming one config per eventType

    const payload = {
      to: [{ email: user.email }],
      templateId: emailConfig.templateId,
      params: {
        subject: emailConfig.subject,
        // Add other params as needed
      }
    };

    return payload;
  }
}

module.exports = PayloadBuilder;
