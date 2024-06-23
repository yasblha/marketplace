const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27018/marketplace';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // 30 secondes
    socketTimeoutMS: 45000,           // 45 secondes
}).then(() => {
    console.log('MongoDB database is connected to marketplace ...');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
