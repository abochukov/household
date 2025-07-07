const express = require('express');
const router = express.Router();
const db = require('../db');

const authenticate = require('./authenticate');

router.get('/', async (req, res) => {
    const username = req.query.username;
    console.log('username');
    console.log(username)
    try {
        const query = `
            SELECT username, email, firstname, lastname, phone, created_at 
            FROM household.users 
            WHERE username = $1`; // Use $1 for parameterized queries in PostgreSQL

        const result = await db.query(query, [username]); // Pass username as parameter

        // Return the addresses as JSON
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 