const mongoose = require('mongoose');
const Conversation = require('./models/conversation');
const MessageQueue = require('./models/messageQueue');
const Message = require('./models/message');

const dbUri = 'mongodb://localhost:27017/doctordarwin';

const connectDB = async () => {
    const db = await mongoose.connect(dbUri);
    const { connection } = db;
    connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
    return connection;
};

const initDB = async () => {
    await mongoose.connection.dropDatabase();
    await Message.init();
    await MessageQueue.init();
    await Conversation.init();
};

const init = async () => {
    const connection = await connectDB();
    console.log('Connected to MongoDB:', connection.name);
    await initDB()
        .then(() => {
            console.log('Database initialized successfully');
        })
        .catch((err) => {
            console.error('Error initializing database:', err);
            connection.close();
            process.exit(1);
        });
    connection.close();
    console.log('Done');
};

console.log('Processing...');
init();
