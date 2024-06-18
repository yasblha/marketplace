const connectMongo = require('mongoose');
const dotenv = require('dotenv');

connectMongo.connect('mongodb://mongo:27018/marketplace')
    .then(() => {
        console.log('MongoDB database is connected to marketplace ...');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });

module.exports = connectMongo;