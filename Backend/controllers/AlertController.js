const Alert = require('../models/postgres_models/Alert');
const User = require('../models/postgres_models/UserPg');

const subscribeToAlert = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Vérifiez si l'utilisateur est déjà abonné à cette alerte
    const existingAlert = await Alert.findOne({
      where: {
        userId: userId,
        productId: productId,
        alert_type: 'stock',
      },
    });

    if (existingAlert) {
      return res.status(400).json({ error: 'User is already subscribed to this alert' });
    }

    // Créez une nouvelle alerte pour le stock
    const alert = await Alert.create({
      alert_type: 'stock',
      status: 'active',
      productId: productId,
      userId: userId,
    });

    // // Construisez le payload de l'email
    // const payload = await PayloadBuilder.build('Product.Restock', userId, productId);

    // // Envoyez l'email
    // await brevoMailing.sendMail(payload);

    res.status(201).json(alert);
  } catch (error) {
    console.error('Error in subscribeToAlert:', error);
    res.status(500).json({ error: error.message });
  }
};

const unsubscribeFromAlert = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await Alert.destroy({
      where: {
        userId: userId,
        productId: productId,
        alert_type: 'stock',
      },
    });

    res.status(200).json({ message: 'Unsubscribed from alert successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


};

const subscribeToNewsletter = async (req, res) => {
  try {
    const { userId } = req.params;

    const alert = await Alert.create({
      alert_type: 'newsletter',
      status: 'active',
      userId: userId,
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { userId } = req.params;

    await Alert.destroy({
      where: {
        userId: userId,
        alert_type: 'newsletter',
      },
    });

    res.status(200).json({ message: 'Unsubscribed from newsletter successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  subscribeToAlert,
  unsubscribeFromAlert,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
};
