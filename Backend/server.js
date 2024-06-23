const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./conf/postgres');

require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/api', subscriptionRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB database is connected to marketplace ...'))
    .catch(err => console.log('Error connecting to MongoDB:', err.message));

db.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

process.on("unhandledRejection", err => {
    console.error(`An unhandled rejection occurred: ${err.message}`);
    server.close(() => process.exit(1));
});
