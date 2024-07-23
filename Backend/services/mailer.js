const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yassineboul98@gmail.com',
        pass: 'syhm zjkv pjmd atak',
    },
});

async function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: 'yassineboul98@gmail.com',
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
