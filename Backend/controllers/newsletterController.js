const User = require('../models/mongo_model/User'); 
const { sendNewProductEmail } = require('../services/mailer');

const subscribeToNewsletter = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { $set: { subscribedToNewsletter: true } },
            { new: true, upsert: true }
        );
        await sendNewProductEmail(email, { name: "Subscription to Newsletter" });
        res.status(200).json({ message: "Successfully subscribed to newsletter." });
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        res.status(500).json({ message: "Error subscribing to newsletter." });
    }
};

module.exports = { subscribeToNewsletter };
