const nodemailer = require('nodemailer');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Pour éviter des erreurs de certificat
  }
});

transporter.sendMail({
  from: process.env.SMTP_USER, // L'email de l'expéditeur doit être le même que l'utilisateur SMTP
  to: 'recipient@example.com', // Remplacez par l'email du destinataire
  subject: 'Test Email',
  text: 'Hello, this is a test email.'
}, (error, info) => {
  if (error) {
    return console.log('Error sending email:', error);
  }
  console.log('Email sent successfully:', info.response);
});
