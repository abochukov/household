const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Add pg import if missing

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

router.get('/allResidentsForAddress', async (req, res) => {
    const username = req.query.username;
    const address = req.query.address;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        // SQL query to fetch residentals for the specified username and address
        const query = `
            SELECT property_number, member_amount
            FROM household.property 
            WHERE created_by = $1 AND address_id=$2`; // Use $1 for parameterized queries in PostgreSQL

        const result = await db.query(query, [username, address]); // Pass username as parameter

        // Return the addresses as JSON
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No members found for this user and address' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;