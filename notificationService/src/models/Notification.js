const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, required: true }, // e.g., email, sms
    status: { type: String, default: 'pending' }, // e.g., pending, sent, failed
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);