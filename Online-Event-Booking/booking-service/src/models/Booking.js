const { DataTypes } = require('sequelize');
const sequelizePromise = require('../utils/db'); // Import the promise

let Booking;

(async () => {
  try {
    const sequelize = await sequelizePromise; // Resolve the promise

    Booking = sequelize.define('Booking', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      event_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      tickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'confirmed', // Default status
      },
    }, {
      tableName: 'bookings',
      timestamps: false,
    });

    // Initialize the table if it doesn't exist
    await Booking.sync({ force: false }); // force: true drops table if exists
    console.log('Bookings table synced');

    // Add static methods to the Booking model
    Booking.createBooking = async (userId, eventId, tickets, status) => {
      return await Booking.create({ user_id: userId, event_id: eventId, tickets, status });
    };

    Booking.findByUserId = async (userId) => {
      return await Booking.findAll({ where: { user_id: userId } });
    };

    Booking.getBookings = async () => {
      return await Booking.findAll();
    };
  } catch (error) {
    console.error('Error initializing Booking model:', error);
  }
})();

module.exports = async () => {
  if (!Booking) {
    const sequelize = await sequelizePromise;
    return sequelize.models.Booking;
  }
  return Booking;
};