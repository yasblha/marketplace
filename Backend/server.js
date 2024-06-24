const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB database is connected to marketplace ...'))
    .catch(err => console.log('Error connecting to MongoDB:', err.message));

// Connexion à PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRESDB_USER,
    host: process.env.POSTGRESDB_HOST,
    database: process.env.POSTGRESDB_DATABASE,
    password: process.env.POSTGRESDB_ROOT_PASSWORD,
    port: 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/api', subscriptionRoutes);

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

process.on("unhandledRejection", err => {
    console.error(`An unhandled rejection occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
