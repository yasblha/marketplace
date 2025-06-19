import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = 'mongodb://mongo:27018/marketplace';

console.log('Attempting to connect to MongoDB with URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB database is connected to marketplace ...');
    })
        .catch((err) => {
            console.error('MongoDB connection error:', err.message);
        });



export default mongoose;