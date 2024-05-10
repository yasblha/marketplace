const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
// Importer la configuration de la base de données
require('./mongodb');
require('./postgres');

app.use(cors());
app.use(bodyParser.json());



// Définir les routes principales
app.get('/', async(req, res) => {
    res.send('Hello World');
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});
