require('dotenv').config({ path: './server/.env' });

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

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
            SELECT address_id, city, neighbourhood, address, entrance, created_at 
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


router.put('/updateAddress/:id', async (req, res) => {
    const { id } = req.params;
    const { city, neighbourhood, address, entranceId } = req.body;

    // Validate input
    if (!city || !neighbourhood || !address || !entranceId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Construct the query to update the address
        const query = `
            UPDATE household.address
            SET city = $1, neighbourhood = $2, address = $3, entrance = $4, updated_at = NOW()
            WHERE address_id = $5
            RETURNING *;
        `;

        const values = [city, neighbourhood, address, entranceId, id];

        // Execute the query
        const result = await db.query(query, values);

        // If the address was not found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Return the updated address
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/deleteAddress/:id', (req, res) => {
  const { id } = req.params;

  // Check if the address ID is provided in the URL
  if (!id) {
    return res.status(400).json({ error: 'Address ID is required' });
  }

  // Execute the DELETE query to remove the address by its ID
  db.query('DELETE FROM household.address WHERE address_id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      // Log the error for debugging and respond with a 500 error
      console.error('Error deleting address:', err);
      return res.status(500).json({ error: 'Error occurred while deleting the address' });
    }

    // If no rows were deleted, the address doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If deletion is successful, respond with a success message
    return res.status(200).json({ message: 'Address successfully deleted' });
  });
});

module.exports = router;
