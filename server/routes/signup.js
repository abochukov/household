require('dotenv').config({ path: './server/.env' });

const { Pool } = require('pg');

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


const isProduction = process.env.NODE_ENV === 'production';
const db = new Pool({
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_LOCAL,
  port: parseInt(isProduction ? process.env.DB_PORT_PROD : process.env.DB_PORT_LOCAL, 10),
  user: String(isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_LOCAL),
  password: String(isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_LOCAL),
  database: String(isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_LOCAL),
  max: 10,
});



db.connect()
  .then(client => {
    return client.query('SELECT NOW()') // Perform a simple query to check the connection
      .then(res => {
        // console.log('Connection successful:', res.rows[0]);
        client.release(); // Release the client back to the pool
      })
      .catch(err => {
        console.error('Error executing query:', err.stack);
      });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.stack);
  });

// Route to handle user signup
router.post('/', async (req, res) => {
  const { username, email, password, firstname, lastname, phone, role = 'superuser' } = req.body;

  console.log(username, email, password, firstname, lastname, phone)

  try {
    // Check if email already exists
    const emailCheckQuery = 'SELECT * FROM household.users WHERE email = $1';
    const emailCheckResult = await db.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'Имейлът вече съществува' });
    }

    // Check if username already exists
    const usernameCheckQuery = 'SELECT * FROM household.users WHERE username = $1';
    const usernameCheckResult = await db.query(usernameCheckQuery, [username]);
    if (usernameCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'Потребителското име вече съществува' });
    }

    // Check if phone already exists
    const phoneCheckQuery = 'SELECT * FROM household.users WHERE phone = $1';
    const phoneCheckResult = await db.query(phoneCheckQuery, [phone]);
    if (phoneCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'Телефонният номер вече съществува' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO household.users (username, email, password, firstname, lastname, phone, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, firstname, lastname, phone, role, created_at';

    const result = await db.query(insertUserQuery, [username, email, hashedPassword, firstname, lastname, phone, role]);
    const newUser = result.rows[0];
    
    // Return the newly created user (without password)
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      phone: newUser.phone,
      role: newUser.role,
      created_at: newUser.created_at // Include created_at in the response
    });
    
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
