const User = require('../models/User');
const { sendPromotionEmail } = require('../utils/email');

// Fonction pour ajouter une promotion
async function addPromotion(req, res) {
    const promotionDetails = req.body;

    try {
        // Logique pour sauvegarder la promotion dans la base de données
        // Par exemple, Promotion.create(promotionDetails);

        await notifyPromotionSubscribers(promotionDetails);

        res.status(200).json({ message: 'Promotion ajoutée avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la promotion:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la promotion.', error: error.message });
    }
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
};
