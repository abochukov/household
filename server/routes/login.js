// routes/login.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is located here

const router = express.Router();

// POST route for login
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ attributes: ['id', 'username', 'password'], where: { username } });
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' });

  // Send token as response
  res.json({ token, username: user.username });
});

module.exports = router;
