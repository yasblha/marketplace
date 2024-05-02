const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilisez votre service de messagerie
    auth: {
        user: 'ibrahim60200@gmail.com',
        pass: 'yvybbowzcccbdmwu'
    }
});

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'ibrahim60200@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
