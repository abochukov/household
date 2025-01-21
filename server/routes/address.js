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

router.post('/createAddress', async (req, res) => {
    const { city, neighbourhood, address, entranceId, created_by } = req.body;
  
    // Validate required fields
    if (!city || !address || !entranceId) {
      return res.status(400).json({ error: 'Missing required fields: city, address, and entranceId are required' });
    }
  
    try {
      // Step 1: Check if the address already exists with the same city, address, and entranceId
      const checkAddressQuery = 'SELECT * FROM household.address WHERE city = $1 AND address = $2 AND entrance = $3';
      const addressExists = await db.query(checkAddressQuery, [city, address, entranceId]);
  
      if (addressExists.rows.length > 0) {
        // Address already exists
        return res.status(400).json({ error: 'This address already exists with the same city, address, and entranceId' });
      }
  
      // Step 2: If no duplicate, insert the new address into the household.address table
      const insertAddressQuery = `
        INSERT INTO household.address (city, neighbourhood, address, entrance, created_at, updated_at, created_by)
        VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)
        RETURNING address_id, city, neighbourhood, address, entrance, created_at, updated_at, created_by
      `;
  
      const result = await db.query(insertAddressQuery, [city, neighbourhood, address, entranceId, created_by]);
      const newAddress = result.rows[0];
  
      // Step 3: Return success response with the newly created address
      res.status(201).json({
        address_id: newAddress.address_id,
        city: newAddress.city,
        neighbourhood: newAddress.neighbourhood,
        address: newAddress.address,
        entrance: newAddress.entrance,
        created_at: newAddress.created_at,
        updated_at: newAddress.updated_at,
        created_by: newAddress.created_by,
      });
    } catch (error) {
      console.error('Error inserting address:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/addressesForUser', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        // SQL query to fetch addresses for the specified username
        const query = `
            SELECT city, neighbourhood, address, entrance, created_at 
            FROM household.address 
            WHERE created_by = $1`; // Use $1 for parameterized queries in PostgreSQL

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
