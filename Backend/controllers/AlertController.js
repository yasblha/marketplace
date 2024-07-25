const Alert = require('../models/postgres_models/Alert');
const User = require('../models/postgres_models/UserPg');
const brevoMailing = require('../server');
const PayloadBuilder = require('../services/brevo/playloadBuilder');

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

    // const payload = await PayloadBuilder.build('Product.OutOfStock', userId, productId);
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
    const { email } = req.params;

    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user.id;

    // Vérifiez si l'utilisateur est déjà abonné à cette newsletter
    const existingAlert = await Alert.findOne({
      where: {
        userId: userId,
        alert_type: 'newsletter',
      },
    });

    if (existingAlert) {
      return res.status(400).json({ error: 'User is already subscribed to the newsletter' });
    }

    // Créez une nouvelle alerte pour la newsletter
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
    const { email } = req.params;

    // Trouver l'utilisateur par e-mail
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user.id;

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
