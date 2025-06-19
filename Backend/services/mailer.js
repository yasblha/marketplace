import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contactprojectys@gmail.com',
        pass: 'mvuogahxlrxrlpwi',
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

export { sendEmail };
