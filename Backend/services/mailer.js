const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // user: 'yassineboul98@gmail.com',
        // pass: 'syhm zjkv pjmd atak',
        user: 'ibrahim60200@gmail.com',
        pass: 'yvybbowzcccbdmwu',
    },
});

async function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: 'ibrahim60200@gmail.com',
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
