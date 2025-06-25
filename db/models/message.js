const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'assistant', 'system'],
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: () => new Date(),
        required: true,
    },
});

module.exports = mongoose.model('Message', messageSchema);
