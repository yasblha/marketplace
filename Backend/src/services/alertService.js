const User = require('../models/User');
const sendEmail = require('./mailer');
const cron = require('node-cron');

async function checkEvents() {
    try {
        const users = await User.find({ 'alerts.newProduct': true });
        for (const user of users) {
            try {
                await sendEmail(user.email, 'Nouveau Produit', 'Un nouveau produit a été ajouté à notre catalogue.');
            } catch (emailError) {
                console.error(`Error sending email to ${user.email}:`, emailError);
            }
        }
    } catch (dbError) {
        console.error('Failed to retrieve users for new product alert:', dbError);
    }
}

// Planifier cette fonction pour s'exécuter toutes les heures, par exemple
cron.schedule('0 * * * *', () => {
    checkEvents();
});

module.exports = { checkEvents };
