require('dotenv').config({ path: './server/.env' });
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const db = new Pool({
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_LOCAL,
  port: parseInt(isProduction ? process.env.DB_PORT_PROD : process.env.DB_PORT_LOCAL, 10),
  user: String(isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_LOCAL),
  password: String(isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_LOCAL),
  database: String(isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_LOCAL),
  max: 10,
});

module.exports = db; 