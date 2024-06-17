const transporter = require('./transporter');

function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'ibrahim60200@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
