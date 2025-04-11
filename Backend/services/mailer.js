const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ecom@mail.com',
        pass: 'pass',
    },
});

async function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: 'ecom@mail.com',
        to,
        subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail sent:', info.response);
    } catch (error) {
        console.error('Error sending e-mail:', error);
    }
}

module.exports = { sendEmail };
