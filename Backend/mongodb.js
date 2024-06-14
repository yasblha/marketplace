const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27018/marketplace')
    .then(() => {
        console.log('MongoDB database is connected to marketplace ...');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });