const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Optional: Auto-delete token after 7 days
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
