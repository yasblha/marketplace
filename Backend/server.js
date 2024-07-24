const express = require('express');
const db = require('./config/postgres');
const mongodb = require('./config/mongodb');
const cors = require('cors');
const bodyParser = require("body-parser");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const authRoutes = require('./routes/api/auth');
const products = require('./routes/api/products')
const uploadRoutes = require('./routes/api/uploadRoute')
const sectionRoutes = require('./routes/api/MenuRoute');
const cartRoutes = require('./routes/api/PanierRoute');
const orderRoutes = require('./routes/api/CommandeRoutes');
const alertRoutes = require('./routes/api/alertRoute');
const cron = require('node-cron');
const upload = require('./middleware/upload');
const cookieParser = require('cookie-parser');
const { checkPasswordRenewal } = require('./services/reset_mail');
//import injectProducts from './utils/faker';
const path = require('path');


require('dotenv').config();

async function init() {
    await checkPasswordRenewal();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(credentials);
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', products);
app.use('/api/upload', uploadRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/alert', alertRoutes);



cron.schedule('0 0 * * *', checkPasswordRenewal);

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
    //init();
});

//injectProducts();

process.on("unhandledRejection", err => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

const BrevoMailing = require('./config/mailing');
const brevoMailing = new BrevoMailing(process.env.BREVO_API_KEY);

// const testPayload = {
//     to: [{ email: 'yassineboul98@gmail.com' }],
//     templateId: 12, // Using the 'Welcome.newUser' template as an example
//     params: {
//       subject: 'Bienvenue sur notre plateforme',
//       productName: 'chocolat chaud'
//     }
//   };
 
// // Example usage with test payload
// brevoMailing.sendMail(testPayload)
//   .then(response => {
//     console.log('Test email sent successfully:', response);
//   })
//   .catch(error => {
//     console.error('Error sending test email:', error);
//   });

module.exports = brevoMailing;
