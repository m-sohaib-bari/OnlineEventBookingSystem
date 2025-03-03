const pool = require('../utils/db');

class Booking {
  static async create(userId, eventId, tickets, status) {
    const query = `
      INSERT INTO bookings (user_id, event_id, tickets, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, eventId, tickets, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM bookings WHERE user_id = $1;';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getBookings() {
    const query = 'SELECT * FROM bookings;';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Booking;