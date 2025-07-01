import 'dotenv/config';

import express        from 'express';
import cors           from 'cors';
import bodyParser     from 'body-parser';
import cookieParser   from 'cookie-parser';
import cron           from 'node-cron';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

//import './config/postgres.js';
import './config/mongodb.js';


import credentials       from './middleware/credentials.js';
import errorHandler      from './middleware/error_handler.js';
import { geocodeAddress } from './utils/geocodeService.js';
import upload            from './middleware/upload.js';

/*───────────────────────────────────
  Routes API
─────────────────────────────────────*/
import authRoutes      from './routes/api/auth.js';
import products        from './routes/api/products.js';
import uploadRoutes    from './routes/api/uploadRoute.js';
import sectionRoutes   from './routes/api/MenuRoute.js';
import cartRoutes      from './routes/api/PanierRoute.js';
import orderRoutes     from './routes/api/CommandeRoutes.js';
import FavoriteRoutes  from './routes/api/FavoriteRoutes.js';
import AddressRoutes   from './routes/api/adresseRoutes.js';
import PaymentRoutes   from './routes/api/PaymentRoutes.js';
import ReturnRoutes    from './routes/api/ReturnsRoutes.js';
import stripeRoutes    from './routes/api/stripeRoutes.js';
import analyticsRoutes from './routes/api/analyticsRoutes.js';
import alertRoutes     from './routes/api/alertRoutes.js';
import checkoutRoutes  from './routes/api/CheckoutRoutes.js';
import syncRoutes      from './routes/api/syncRoutes.js';
import stockRoutes     from './routes/api/stockRoutes.js';
import settingsRoutes   from './routes/api/settingsRoutes.js';

/*  Services */
import { checkPasswordRenewal } from './services/reset_mail.js';
// import injectProducts          from './utils/faker.js';
import { syncDatabase }         from './synchronize.js';
import SyncService              from './services/syncService.js';
import CronService              from './services/CronService.js';

/*───────────────────────────────────
  Variables d'environnement (debug)
─────────────────────────────────────*/
console.log('JWT_SECRET :', process.env.JWT_SECRET);
console.log('NODE_ENV   :', process.env.NODE_ENV);

/*───────────────────────────────────
  Préparation Express
─────────────────────────────────────*/
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(credentials);
app.use(cookieParser());

/*───────────────────────────────────
  Montage des routes
─────────────────────────────────────*/
app.use('/api/auth',       authRoutes);
app.use('/api/products',   products);
app.use('/api/upload',     uploadRoutes);
app.use('/api/sections',   sectionRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/favorites',  FavoriteRoutes);
app.use('/api/addresses',  AddressRoutes);
app.use('/api/payments',   PaymentRoutes);
app.use('/api/returns',    ReturnRoutes);
app.use('/api/stripe',     stripeRoutes);
app.use('/api/analytics',  analyticsRoutes);
app.use('/api/alerts',     alertRoutes);
app.use('/api/checkout',   checkoutRoutes);
app.use('/api/sync',       syncRoutes);
app.use('/api/stock',      stockRoutes);
app.use('/api/settings',   settingsRoutes);

/*───────────────────────────────────
  Fichiers statiques
─────────────────────────────────────*/
app.use('/uploads', express.static(join(__dirname, 'uploads')));

/*───────────────────────────────────
  Cron – réinitialisation de mot de passe
─────────────────────────────────────*/
cron.schedule('0 0 * * *', checkPasswordRenewal);

/*───────────────────────────────────
  Endpoints utilitaires
─────────────────────────────────────*/
app.get('/geocode', async (req, res) => {
    const address = req.query.q;
    if (!address) return res.status(400).json({ error: 'Address query parameter is required' });

    try {
        const results = await geocodeAddress(address);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
});

app.get('/', (_req, res) => res.send('Welcome to my server!'));

/*───────────────────────────────────
  Sync BDD puis lancement serveur
─────────────────────────────────────*/
await syncDatabase();

// Configuration de la synchronisation périodique
const setupPeriodicSync = () => {
    // Synchronisation toutes les 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            console.log('🕐 Synchronisation périodique PostgreSQL ↔ MongoDB...');
            await SyncService.fullSync();
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation périodique:', error);
        }
    });
    
    // Synchronisation complète au démarrage
    setTimeout(async () => {
        try {
            console.log('🚀 Synchronisation initiale au démarrage...');
            await SyncService.fullSync();
        } catch (error) {
            console.error('❌ Erreur lors de la synchronisation initiale:', error);
        }
    }, 10000); // 10 secondes après le démarrage
};

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
    // Démarrer la synchronisation périodique après le démarrage du serveur
    setupPeriodicSync();
    // Initialiser les tâches cron
    CronService.init();
});

// await checkPasswordRenewal();
// injectProducts();

/*───────────────────────────────────
  Gestion des promesses non gérées
─────────────────────────────────────*/
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});
