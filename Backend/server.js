const express = require('express');
const db = require('./config/postgres');
const mongodb = require('./config/mongodb');
const cors = require('cors');
const bodyParser = require("body-parser");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const authRoutes = require('./routes/api/auth');
//const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
const { checkPasswordRenewal } = require('./services/reset_mail');

require('dotenv').config();

async function test() {
    await checkPasswordRenewal();
}
//test();

const app = express();
const PORT = process.env.PORT ;

// Middleware pour parser les JSON et les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(credentials);
app.use(cookieParser);

// Routes
app.use('/api/auth', authRoutes);

//check les mots de passes qui arrivent à expiration et envoie un mail de reset
cron.schedule('0 0 * * *', checkPasswordRenewal);

// 404 Handler
/*app.all('*', (req, res) => {
    res.sendStatus(404);
    if(req.accepts('json')) {
        res.json({'error': '404 not found}'})
    } else {
        res.type('text').send('404 Not found')
    }
});*/

/*app.get('/users', User.getUsers);
app.get('/users/:id', User.getUserById);
app.post('/users/create', User.createUser);
app.put('/users/:id', User.updateUser);
app.delete('/users/:id', User.deleteUser);*/

// Middleware d'erreurs
app.use(errorHandler);

// Démarrez l'application
app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

// Gestionnaire d'erreurs globales
process.on("unhandledRejection", err => {
    console.log(`Une erreur a eu lieu: ${err.message}`);
    server.close(() => process.exit(1));
});
