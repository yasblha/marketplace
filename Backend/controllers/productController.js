const User = require('../models/User');
const { sendNewProductEmail } = require('../utils/email');

exports.addProduct = async (req, res) => {
    const productDetails = req.body;

    // Add logic to save the product to the database here

    try {
        await notifyNewProductSubscribers(productDetails);
        res.status(200).json({ message: 'Product added and notifications sent successfully.' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product.' });
    }
};

async function notifyNewProductSubscribers(productDetails) {
    try {
        const users = await User.find({ 'alerts.newProduct': true });
        
        for (const user of users) {
            await sendNewProductEmail(user.email, productDetails);
        }
    } catch (error) {
        console.error('Error notifying subscribers:', error);
    }
}
