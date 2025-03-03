const Booking = require('../models/Booking');
const { getChannel } = require('../utils/rabbitmq');
const axios = require('axios');
require('dotenv').config();

class BookingService {
  static async createBooking(userId, eventId, requestedTickets) {
    let event = 'Event';
    try {
      // Step 1: Check if the event exists and is available
      const isEventAvailable = await axios.get(`${process.env.EVENT_SERVICE_URL}/events/${eventId}/availability`);
      try {
        if (!isEventAvailable.data) {
          throw new Error('Booking not available for this event.');
        }
      } catch (error) {
        const bookingStatus = 'cancelled';
        const booking = await Booking.create(userId, eventId, requestedTickets, bookingStatus);
  
        const notification = {
          userId,
          channel: 'email',
          message: `Booking of ${requestedTickets} ticket(s) failed, as ${event.name} is not available.`,
        };
    
        const channel = getChannel();
        channel.sendToQueue(
          process.env.EVENT_BOOKING,
          Buffer.from(JSON.stringify(notification))
        );
        throw new Error('Failed to retrieve event availability.');
      }
  
      // Step 2: Fetch the full event details to get the available tickets
      const eventResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/events/${eventId}`);
      if (!eventResponse.data) {
        throw new Error('Failed to retrieve event details.');
      }
      event = eventResponse.data;
      const availableTickets = event.availableTickets;
  
      try {
        if (availableTickets <= 0) {
          throw new Error('No tickets available for this event.');
        }
      } catch (error) {
        const bookingStatus = 'cancelled';
        const booking = await Booking.create(userId, eventId, requestedTickets, bookingStatus);
  
        const notification = {
          userId,
          channel: 'email',
          message: `Booking of ${requestedTickets} ticket(s) failed, as ${event.name} is sold out.`,
        };
    
        const channel = getChannel();
        channel.sendToQueue(
          process.env.EVENT_BOOKING,
          Buffer.from(JSON.stringify(notification))
        );
        throw new Error('No tickets available for this event.');
      }
  
      // NOT IMPLEMENTING THE FOLLOWING AS IT REQUIRES FRONTEND INTERACTION
      // // Step 3: Handle cases where requested tickets exceed available tickets
      // if (requestedTickets > availableTickets) {
      //   const userChoice = await promptUser(`Only ${availableTickets} tickets are available. Do you want to book the remaining tickets? (yes/no)`);
  
      //   if (userChoice.toLowerCase() !== 'yes') {
      //     throw new Error('Booking terminated by user.');
      //   }
  
      //   // Update requested tickets to the available tickets
      //   requestedTickets = availableTickets;
      // }

      try {
        if (requestedTickets > availableTickets) {
          throw new Error('Requested tickets exceed available tickets.');
        }
      }
      catch (error) {
        const bookingStatus = 'cancelled';
        const booking = await Booking.create(userId, eventId, requestedTickets, bookingStatus);
  
        const notification = {
          userId,
          channel: 'email',
          message: `Booking of ${requestedTickets} ticket(s) failed, as ${event.name} does not have enough tickets.`,
        };
    
        const channel = getChannel();
        channel.sendToQueue(
          process.env.EVENT_BOOKING,
          Buffer.from(JSON.stringify(notification))
        );
        throw new Error('Requested tickets exceed available tickets.');
      }
  
      // Step 4: Update the event with the new ticket count
      const updatedEvent = {
        ...event, // Include the rest of the event object
        availableTickets: availableTickets - requestedTickets,
      };
  
      await axios.put(`${process.env.EVENT_SERVICE_URL}/events/update/${eventId}`, updatedEvent);
  
      // Step 5: Create the booking with the correct status
      const bookingStatus = 'confirmed';
      const booking = await Booking.create(userId, eventId, requestedTickets, bookingStatus);

      const notification = {
        userId,
        channel: 'email',
        message: `You have successfully booked ${requestedTickets} ticket(s) for ${event.name}.`,
      };
  
      // Step 6: Send a message to RabbitMQ
      const channel = getChannel();
      channel.sendToQueue(
        process.env.EVENT_BOOKING,
        Buffer.from(JSON.stringify(notification))
      );
  
      return booking;
    } catch (error) {
      const bookingStatus = 'cancelled';
      const booking = await Booking.create(userId, eventId, requestedTickets, bookingStatus);

      const notification = {
        userId,
        channel: 'email',
        message: `Booking of ${requestedTickets} ticket(s) failed for ${event.name}.`,
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
    try {
      const bookings = await Booking.findByUserId(userId);
      return bookings;
    } catch (error) {
      throw new Error(`Failed to fetch bookings for the user: ${error.message}`);
    }
  }

  static async getBookings() {
    try {
      const bookings = await Booking.getBookings();
      return bookings;
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }
}

module.exports = BookingService;