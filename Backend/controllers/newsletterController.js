const User = require('../models/mongo_models/User');
const { sendEmail } = require('../services/mailer');

exports.sendPromotions = async (req, res) => {
    try {
        const users = await User.find({ newsletter: true });

        const emailPromises = users.map(user =>
            sendEmail(user.email, 'Nouvelle Promotion', 'Découvrez nos nouveaux produits et promotions !')
        );

        await Promise.all(emailPromises);

        res.status(200).json({ message: 'Les emails promotionnels ont été envoyés avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails promotionnels :', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi des emails promotionnels.' });
    }
};
