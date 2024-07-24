const brevoMailingConfig = require('./brevoConfig');
const  User = require('../../models/postgres_models/UserPg');
const  Product = require('../../models/postgres_models/ProductPg');
class PayloadBuilder {
  static async build(eventType, userId, productId = null) {
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

    if (eventType.startsWith('Product.') && productId) {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      payload.params.productName = product.name; // Add the product name to the parameters
      payload.params.productQuantity = product.quantity; // Add the product quantity to the parameters
    }

    return payload;
  }
}

module.exports = PayloadBuilder;
