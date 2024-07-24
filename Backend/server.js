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
const PayloadBuilder = require('./services/brevo/playloadBuilder');
const Alert = require('./models/postgres_models/Alert');

const brevoMailing = new BrevoMailing(process.env.BREVO_API_KEY);

async function sendAlert(eventType, userId, productId) {
  try {
    const payload = await PayloadBuilder.build(eventType, userId, productId);
    const response = await brevoMailing.sendAlert(payload);

    // Update the alert status
    const alert = await Alert.create({ 
      alert_type: eventType, 
      status: 'sent', 
      user_id: userId, 
      product_id: productId 
    });

    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending alert:', error);
  }
}

// Example usage with PayloadBuilder
sendAlert('Welcome.newUser', 1, null); // Replace with actual userId and productId

// Example usage with test payload
brevoMailing.sendAlert(testPayload)
  .then(response => {
    console.log('Test email sent successfully:', response);
  })
  .catch(error => {
    console.error('Error sending test email:', error);
  });