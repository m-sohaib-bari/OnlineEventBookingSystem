const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { sendNotification } = require('./controllers/notificationController');
const { connect } = require('./utils/rabbitmq');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.post('/notify', sendNotification);

// Connect to RabbitMQ
connect();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Notification Service running on http://localhost:${PORT}`);
});