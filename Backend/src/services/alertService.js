const User = require('../models/User');
const sendEmail = require('./mailer');
const cron = require('node-cron');

function checkEvents() {
    // Logique pour vérifier les événements ici
    User.find({ 'alerts.newProduct': true }).then(users => {
        users.forEach(user => {
            sendEmail(user.email, 'Nouveau Produit', 'Un nouveau produit a été ajouté à notre catalogue.');
        });
    });
}

// Planifier cette fonction pour s'exécuter toutes les heures, par exemple
cron.schedule('0 * * * *', () => {
    checkEvents();
});

module.exports = { checkEvents };
