// // backend/utils/email.js
// const nodemailer = require('nodemailer');
// const { URL } = require('url');
// require('dotenv').config();

// const parseMailerDsn = (dsn) => {
//     const url = new URL(dsn);
//     return {
//         host: url.hostname,
//         port: url.port,
//         secure: url.searchParams.get('encryption') === 'tls', // true for 465, false for other ports
//         auth: {
//             user: url.username,
//             pass: url.password
//         }
//     };
// };

// const transporterConfig = parseMailerDsn(process.env.MAILER_DSN);

// const transporter = nodemailer.createTransport({
//     host: transporterConfig.host,
//     port: transporterConfig.port,
//     secure: transporterConfig.secure,
//     auth: {
//         user: transporterConfig.auth.user,
//         pass: transporterConfig.auth.pass
//     }
// });

// const sendAlertEmail = (userEmail, alertType) => {
//     const mailOptions = {
//         from: transporterConfig.auth.user,
//         to: userEmail,
//         subject: `New Alert: ${alertType}`,
//         text: `You have a new alert for ${alertType}.`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//         } else {
//             console.log('Email sent:', info.response);
//         }
//     });
// };

// module.exports = { sendAlertEmail };




const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true pour le port 465, false pour les autres ports
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

module.exports = { sendAlertEmail };
