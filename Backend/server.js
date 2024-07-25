const express = require('express');
const db = require('./config/postgres');
const mongodb = require('./config/mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const authRoutes = require('./routes/api/auth');
const products = require('./routes/api/products');
const uploadRoutes = require('./routes/api/uploadRoute');
const sectionRoutes = require('./routes/api/MenuRoute');
const cartRoutes = require('./routes/api/PanierRoute');
const orderRoutes = require('./routes/api/CommandeRoutes');
const cookieRoutes = require('./routes/api/cookieRoutes');
const FavoriteRoutes = require('./routes/api/FavoriteRoutes');
const cron = require('node-cron');
const upload = require('./middleware/upload');
const cookieParser = require('cookie-parser');
const { checkPasswordRenewal } = require('./services/reset_mail');
// import injectProducts from './utils/faker';
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
app.use(cookieParser()); // Assurez-vous que cookie-parser est utilisé avant la définition des routes

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', products);
app.use('/api/upload', uploadRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/favorites', FavoriteRoutes);
app.use('/api/cookies', cookieRoutes);  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Planifier la vérification du renouvellement du mot de passe
cron.schedule('0 0 * * *', checkPasswordRenewal);

// Gestion des erreurs
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
    // init();
});

// injectProducts(); // Décommentez si nécessaire

// Gestion des erreurs non capturées
process.on('unhandledRejection', err => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

