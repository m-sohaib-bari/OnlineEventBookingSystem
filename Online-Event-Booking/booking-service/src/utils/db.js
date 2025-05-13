const { Sequelize } = require('sequelize');

async function getSequelizeInstance() {
  // 1. First connect to the default postgres database to create our app database
  const adminSequelize = new Sequelize('postgres', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: 'postgres'
  });

  try {
    // Check if database exists, if not create it
    await adminSequelize.query(`CREATE DATABASE bookings;`);
    console.log('Database created or already exists');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Database already exists');
    } else {
      console.error('Database creation error:', error);
      throw error;
    }
  } finally {
    await adminSequelize.close();
  }

  // 2. Now connect to our application database
  const sequelize = new Sequelize('bookings', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: 'postgres'
  });

  // Test the connection
  try {
    await sequelize.authenticate();
    console.log('Connection to bookings database established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to bookings database:', error);
    throw error;
  }
}

// Export a promise that resolves to the sequelize instance
module.exports = getSequelizeInstance();