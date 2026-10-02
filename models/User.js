const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 5000 },
    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: '' },
    transactions: [{ type: { type: String }, amount: Number, status: { type: String, default: 'Success' }, date: { type: Date, default: Date.now } }],
    isAdmin: { type: Boolean, default: false }
});
module.exports = mongoose.model('User', userSchema);
