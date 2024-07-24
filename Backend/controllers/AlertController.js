const Alert = require('../models/postgres_models/Alert');
const AlertUser = require('../models/postgres_models/AlertUser');
const User = require('../models/postgres_models/UserPg');

const subscribeToAlert = async (req, res) => {
  try {
    const { user_id, alert_id } = req.body;

    // Create a subscription for the user
    const alertUser = await AlertUser.create({ userId: user_id, alertId: alert_id });
    res.status(201).json(alertUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unsubscribeFromAlert = async (req, res) => {
  try {
    const { user_id, alert_id } = req.body;
    await AlertUser.destroy({ where: { userId: user_id, alertId: alert_id } });
    res.status(200).json({ message: 'Unsubscribed from alert successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ email }); 
    }
    const alert = await Alert.findOne({ where: { alert_type: 'newsletter' } });
    const alertUser = await AlertUser.create({ userId: user.id, alertId: alert.id });
    res.status(201).json(alertUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const alert = await Alert.findOne({ where: { alert_type: 'newsletter' } });
    await AlertUser.destroy({ where: { userId: user.id, alertId: alert.id } });
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
