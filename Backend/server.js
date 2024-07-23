const express = require('express');
const db = require('./config/postgres');
const mongodb = require('./config/mongodb');
const cors = require('cors');
const bodyParser = require("body-parser");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const authRoutes = require('./routes/api/auth');
const products = require('./routes/api/products');
const uploadRoutes = require('./routes/api/uploadRoute');
const cron = require('node-cron');
const upload = require('./middleware/upload');
const cookieParser = require('cookie-parser');
const { checkPasswordRenewal } = require('./services/reset_mail');
const path = require('path');

require('dotenv').config();

async function init() {
    await checkPasswordRenewal();
}

const app = express();
const PORT = process.env.PORT || 3000;
const TEST_PORT = 3001;  // Port différent pour les tests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(credentials);
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', products);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

cron.schedule('0 0 * * *', checkPasswordRenewal);

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

app.use(errorHandler);

let server;

if (require.main === module) {
    server = app.listen(PORT, () => {
        console.log(`App is listening at http://localhost:${PORT}`);
        //init();
    });

    process.on("unhandledRejection", err => {
        console.error(`Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });
} else {
    // Utiliser un port différent pour les tests
    server = app.listen(TEST_PORT, () => {
        console.log(`Test server is listening at http://localhost:${TEST_PORT}`);
    });
}

module.exports = { app, server };
