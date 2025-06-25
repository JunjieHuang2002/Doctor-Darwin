const mongoose = require('mongoose');
const message = require('./message');

const messageQueueSchema = new mongoose.Schema({
    messages: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }],
        default: [],
        required: true,
    },
});

module.exports = mongoose.model('MessageQueue', messageQueueSchema);
