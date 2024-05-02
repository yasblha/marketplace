const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    alerts: { type: Map, of: Boolean },  
    alerts : { 'newProduct': true, 'priceChange': false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;