const amqp = require('amqplib');
require('dotenv').config();

let channel;

const connect = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(process.env.EVENT_BOOKING, { durable: false });
  console.log('Connected to RabbitMQ');
};

const getChannel = () => channel;

module.exports = { connect, getChannel };