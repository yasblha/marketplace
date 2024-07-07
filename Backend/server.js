const express = require('express');
const db = require('./config/postgres');
const mongodb = require('./config/mongodb');
const cors = require('cors');
const bodyParser = require("body-parser");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const authRoutes = require('./routes/api/auth');
const products = require('./routes/api/products')
const cron = require('node-cron');
const upload = require('./middleware/upload');
const cookieParser = require('cookie-parser');
const { checkPasswordRenewal } = require('./services/reset_mail');

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

cron.schedule('0 0 * * *', checkPasswordRenewal);

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        res.status(201).json({ message: 'Image téléchargée avec succès', path: req.file.path });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
    //init();
});

process.on("unhandledRejection", err => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
