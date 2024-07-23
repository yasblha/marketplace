const User = require('../models/mongo_models/User');
const { sendPromotionEmail } = require('../services/mailer');

async function addPromotion(promotionDetails) {
    // Logique d'ajout de la promotion (par exemple, sauvegarder la promotion dans la base de données)

    await notifyPromotionSubscribers(promotionDetails);
}

async function notifyPromotionSubscribers(promotionDetails) {
    try {
        const users = await User.find({ 'alerts.promotion': true });
        
        for (const user of users) {
            await sendPromotionEmail(user.email, promotionDetails);
        }
    } catch (error) {
        console.error('Erreur lors de la notification des abonnés:', error);
    }
}

module.exports = {
    addPromotion,
    notifyPromotionSubscribers,
};
