const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ibrahim60200@gmail.com',
        pass: 'yvybbowzcccbdmwu'
    }
});

module.exports = transporter;
