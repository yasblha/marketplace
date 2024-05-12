const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const { faker } = require('@faker-js/faker');
const db = require ('./conf/postgres');

require('dotenv').config();
// Importer la configuration de la base de données
require('./conf/mongodb');
require('./conf/postgres');

// app/json response
app.use(express.json());
//le middleware pour les cookies
app.use(cookieParser())
app.use(cors());
app.use(bodyParser.json());

async function getUserData() {
    try {
        const result = await db.query('SELECT * FROM "User"');
        console.log(result.rows);
    } catch (err) {
        console.error(err);
    }
}


// Définir les routes principales
app.get('/', async(req, res) => {
    res.send(getUserData());
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

//error Handler
process.on("UnhendledRejection", err => {
    console.log(`une erreur a eu lieu: ${err.message}`)
    server.close(() => process.exit(1))
})
