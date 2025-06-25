const mongoose = require('mongoose');
const messageQueue = require('./messageQueue');

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    msg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageQueue',
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        required: true,
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
        required: true,
    },
});

module.exports = mongoose.model('Conversation', conversationSchema);
