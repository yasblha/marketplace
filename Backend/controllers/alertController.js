const User = require('../models/mongo_models/User');
const { sendAlertEmail, sendPromotionEmail, sendNewProductEmail } = require('../services/mailer');

exports.subscribe = async (req, res) => {
    const { email, alertType, userToken } = req.body;

    if (!email || !alertType) {
        return res.status(400).json({ message: 'Email and alert type are required.' });
    }

    try {
        let user = await User.findOneAndUpdate(
            { email: email },
            { $set: { [`alerts.${alertType}`]: true } },
            { new: true, upsert: true }
        );

        if (user) {
            await sendAlertEmail(email, alertType);
            res.status(200).json({ message: `Subscribed to ${alertType} successfully.`, user: user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error subscribing to alerts.' });
    }
};

exports.unsubscribe = async (req, res) => {
    const { email, alertType } = req.body;

    if (!email || !alertType) {
        return res.status(400).json({ message: 'Email and alert type are required.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { [`alerts.${alertType}`]: false } },
            { new: true }
        );

        if (user) {
            await sendAlertEmail(email, `Unsubscribed from ${alertType}`);
            res.status(200).send({ message: `Unsubscribed from ${alertType} successfully.`, user: user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};
