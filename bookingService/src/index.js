const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connect } = require('./utils/rabbitmq');
const { createBooking, getBookingsByUserId, getBookings } = require('./controllers/bookingController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/bookings', getBookings);
app.post('/bookings/create', createBooking);
app.get('/bookings/:userId', getBookingsByUserId);

// Start the server
app.listen(PORT, async () => {
  await connect(); // Connect to RabbitMQ
  console.log(`Booking Service running on port ${PORT}`);
});