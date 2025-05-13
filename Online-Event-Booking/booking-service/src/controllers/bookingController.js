const BookingService = require('../services/bookingService');

const createBooking = async (req, res) => {
  const { userId, eventId, tickets } = req.body;
  try {
    const booking = await BookingService.createBooking(userId, eventId, tickets);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookingsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await BookingService.getBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await BookingService.getBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getBookingsByUserId, getBookings };