const Alert = require('../models/postgres_models/Alert');
const AlertUser = require('../models/postgres_models/AlertUser');
const User = require('../models/postgres_models/UserPg');

const createAlert = async (req, res) => {
    try {
      const { alert_type, status, productId } = req.body;
      const alert = await Alert.create({ alert_type, status, productId });
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteAlert = async (req, res) => {
    try {
      const { id } = req.params;
      await Alert.destroy({ where: { id } });
      res.status(200).json({ message: 'Alert deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const subscribeToAlert = async (req, res) => {
    try {
      const { userId, alertId } = req.body;
      const alertUser = await AlertUser.create({ userId, alertId });
      res.status(201).json(alertUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const unsubscribeFromAlert = async (req, res) => {
    try {
      const { userId, alertId } = req.body;
      await AlertUser.destroy({ where: { userId, alertId } });
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
      const alertUser = await AlertUser.create({ userId: user.id, alertId: 2 }); // Assuming alertId 2 is for newsletter
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
      await AlertUser.destroy({ where: { userId: user.id, alertId: 2 } }); // Assuming alertId 2 is for newsletter
      res.status(200).json({ message: 'Unsubscribed from newsletter successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    createAlert,
    deleteAlert,
    subscribeToAlert,
    unsubscribeFromAlert,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
  };