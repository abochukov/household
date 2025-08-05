const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const db = new Pool({
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_LOCAL,
  port: parseInt(isProduction ? process.env.DB_PORT_PROD : process.env.DB_PORT_LOCAL, 10),
  user: isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_LOCAL,
  password: isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_LOCAL,
  database: isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_LOCAL,
  max: 10,
});

db.connect()
  .then(client => {
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('Database connected successfully:', res.rows[0]);
        client.release();
      })
      .catch(err => {
        console.error('Error executing query:', err.stack);
      });
  })
  .catch(err => {
    console.error('Error connecting to database:', err.stack);
  });

module.exports = db;
