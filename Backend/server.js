// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const port = process.env.PORT || 3001;

// app.use(cors());

// // Utiliser les méthodes intégrées d'Express au lieu de bodyParser
// app.use(express.json());  // pour parser les corps de requêtes JSON
// app.use(express.urlencoded({ extended: true }));  // pour parser les corps de requêtes URL-encoded

// const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
// app.use('/api', subscriptionRoutes);

// // Gérer les requêtes API
// app.get('/api/hello', (req, res) => {
//     res.json({ message: 'Hello from the server!' });
// });

// app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../FrontEnd/dist', 'index.html'));
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;  // Changez le port ici
const { faker } = require('@faker-js/faker');
const db = require('./conf/postgres');

require('dotenv').config();
// Importer la configuration de la base de données
require('./conf/mongodb');
require('./conf/postgres');

// Configurer CORS
app.use(cors());
app.use(express.json());
// le middleware pour les cookies
app.use(cookieParser());
app.use(bodyParser.json());

async function getUserData() {
    try {
        const result = await db.query('SELECT * FROM "User"');
        console.log(result.rows);
        return result.rows;
    } catch (err) {
        console.error(err);
    }
}

// Définir les routes principales
app.get('/', async (req, res) => {
    const data = await getUserData();
    res.send(data);
});

// Exemple pour une route d'abonnement avec Express.js
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email, alertType } = req.body;

        // Votre logique d'abonnement ici
        if (!email || !alertType) {
            throw new Error('Email and alert type are required');
        }

        // Simuler une réponse réussie
        res.json({ message: 'Subscription successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

// Error handler
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
