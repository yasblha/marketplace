const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendAlertEmail = (userEmail, alertType) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `New Alert: ${alertType}`,
        text: `You have a new alert for ${alertType}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

async function sendPromotionEmail(email, promotionDetails) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Nouvelle Promotion !',
        text: `Bonjour ! Il y a une nouvelle promotion : ${promotionDetails.name}. Découvrez-la !`,
        html: `<p>Bonjour ! Il y a une nouvelle promotion : <strong>${promotionDetails.name}</strong>. Découvrez-la !</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de promotion envoyé à ${email}`);
    } catch (error) {
        console.error(`Erreur lors de l'envoi de l'email de promotion à ${email}:`, error);
    }
}

module.exports = {
    sendAlertEmail,
    sendPromotionEmail,
};
