const BookingPromise = require('../models/Booking'); // Import the promise
const { getChannel } = require('../utils/rabbitmq');
const axios = require('axios');
require('dotenv').config();

class BookingService {
  static async createBooking(userId, eventId, requestedTickets) {
    const Booking = await BookingPromise(); // Resolve the Booking model
    let event;
    try {
      const eventResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/events/${eventId}`);
      event = eventResponse.data;
      if (!eventResponse.data) {
        throw new Error('Failed to retrieve event details.');
      }

      const isEventAvailable = await axios.get(`${process.env.EVENT_SERVICE_URL}/events/${eventId}/availability`);
      if (!isEventAvailable.data) {
        throw new Error(`Booking not available for this event as it is either COMPLETED or event has no available tickets.`);
      }

      const availableTickets = event.availableTickets;
      if (requestedTickets > availableTickets) {
        throw new Error('Requested tickets exceed available tickets.');
      }

      const updatedEvent = {
        ...event, // Include the rest of the event object
        availableTickets: availableTickets - requestedTickets,
      };
      await axios.put(`${process.env.EVENT_SERVICE_URL}/events/update/${eventId}`, updatedEvent);

      const bookingStatus = 'confirmed';
      const booking = await Booking.createBooking(userId, eventId, requestedTickets, bookingStatus);

      const notification = {
        userId,
        channel: 'email',
        message: `You have successfully booked ${requestedTickets} ticket(s) for ${event.name}.`,
      };

      const channel = getChannel();
      channel.sendToQueue(
        process.env.EVENT_BOOKING,
        Buffer.from(JSON.stringify(notification))
      );

      return booking;
    } catch (error) {
      const Booking = await BookingPromise(); // Ensure Booking is resolved in the catch block
      const bookingStatus = 'cancelled';
      const booking = await Booking.createBooking(userId, eventId, requestedTickets, bookingStatus);

      const eventName = event?.name || 'the selected event';
      const notification = {
        userId,
        channel: 'email',
        message: `Booking of ${requestedTickets} ticket(s) failed for ${eventName}. Reason: ${error.message}`,
      };

      const channel = getChannel();
      channel.sendToQueue(
        process.env.EVENT_BOOKING,
        Buffer.from(JSON.stringify(notification))
      );
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  static async getBookingsByUserId(userId) {
    const Booking = await BookingPromise(); // Resolve the Booking model
    try {
      const bookings = await Booking.findByUserId(userId);
      return bookings;
    } catch (error) {
      throw new Error(`Failed to fetch bookings for the user: ${error.message}`);
    }
  }

  static async getBookings() {
    const Booking = await BookingPromise(); // Resolve the Booking model
    try {
      const bookings = await Booking.getBookings();
      return bookings;
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }
}

module.exports = BookingService;