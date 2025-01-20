const { Pool } = require('pg');

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const db = new Pool({
  host: 'localhost',            // Database host (localhost for local machine)
  port: 5432,                  // PostgreSQL default port
  user: 'postgres',            // Your PostgreSQL username
  password: 'postgres',            // Your PostgreSQL password
  database: 'household',       // Your database name
  max: 10,                     // Maximum number of connections in the pool
});


db.connect()
  .then(client => {
    return client.query('SELECT NOW()') // Perform a simple query to check the connection
      .then(res => {
        console.log('Connection successful:', res.rows[0]);
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
  const { username, email, password, firstname, lastname, phone } = req.body;

  console.log(username, email, password, firstname, lastname, phone)

  // Check if email already exists
  const emailCheckQuery = 'SELECT * FROM household.users WHERE email = $1';
  const emailCheckResult = await db.query(emailCheckQuery, [email]);

  if (emailCheckResult.rows.length > 0) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert the new user into the database
  const insertUserQuery = 'INSERT INTO household.users (username, email, password, firstname, lastname, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, firstname, lastname, phone';
  try {
    const result = await db.query(insertUserQuery, [username, email, hashedPassword, firstname, lastname, phone]);
    const newUser = result.rows[0];

    // Return the newly created user (without password)
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      phone: newUser.phone
    });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
