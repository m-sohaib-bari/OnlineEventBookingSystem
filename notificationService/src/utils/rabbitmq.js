const { model } = require('mongoose');
const { sendNotification } = require('../services/notificationService');
const amqp = require('amqplib');
require('dotenv').config();

async function connect() {
    let conncetion;
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        return;
    }
    const channel = await connection.createChannel();
    const queueBooking = process.env.EVENT_BOOKING;
    await channel.assertQueue(queueBooking, { durable: false });

    console.log('Connected to RabbitMQ. Waiting for booking events in the queue...');

    channel.consume(queueBooking, async (message) => {
        if (message !== null) {
            const notification = JSON.parse(message.content.toString());
            console.log('Received event:', notification);

            // Process the notification (e.g., send email)
            await sendNotification(notification);

            // Acknowledge the message
            channel.ack(message);
        }
    });
}

module.exports = { connect };