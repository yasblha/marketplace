const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    alerts: {
        newProduct: { type: Boolean, default: false },
        priceChange: { type: Boolean, default: false },
        promotion: { type: Boolean, default: false }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
