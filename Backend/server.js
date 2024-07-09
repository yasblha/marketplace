const express = require('express');
const mongoose = require('./conf/mongodb');
const pool = require('./conf/postgres');
const cors = require('cors');
const bodyParser = require("body-parser");
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/error_handler');
const alertRoutes = require('./routes/api/alerts');
const promotionRoutes = require('./routes/api/promotions'); 
const productRoutes = require('./routes/api/product')  

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(credentials);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/product', productRoutes);

// Error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

const server = app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});

// Global error handler for unhandled rejections
process.on("unhandledRejection", err => {
    console.log(`Une erreur a eu lieu: ${err.message}`);
    server.close(() => process.exit(1));
});
