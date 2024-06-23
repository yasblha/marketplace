const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27018/marketplace';

console.log(`Tentative de connexion à MongoDB avec l'URI : ${mongoUri}`);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // 30 secondes
    socketTimeoutMS: 45000,           // 45 secondes
}).then(() => {
    console.log('La base de données MongoDB est connectée à marketplace ...');
    mongoose.connection.close();
}).catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    mongoose.connection.close();
});
