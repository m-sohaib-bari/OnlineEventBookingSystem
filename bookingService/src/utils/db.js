// Could have sequelize or other ORM here
// To automate the process of creating tables and models
// But we will use raw SQL queries for this project
// As sequelizing would have required a lot of refactoring
// And it is also not the focus of this project

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;

/* TABLE CREATION COMMAND
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    tickets INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL
);
*/