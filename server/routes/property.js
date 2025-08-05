// require('dotenv').config({ path: './server/.env' });
require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Add pg import if missing
const db = require('../db');

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

router.post('/createProperty', async (req, res) => {
  const { 
    city, neighbourhood, address, entranceId, propertyNumber, floor, area, memberAmount, pets, rent, username, created_by, phone, isElevatorUsed, email, residents, password, address_id
  } = req.body;

  // Validate required fields
  // if (!city || !address || !entranceId || !propertyNumber || !floor || !area || !memberAmount || !rent || !username || !phone || !password) {
  if (!city || !address || !entranceId || !propertyNumber || !username || !phone || !password) {

    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate memberAmount is a number
  const parsedMemberAmount = parseInt(memberAmount, 10);
  if (isNaN(parsedMemberAmount)) {
    return res.status(400).json({ error: 'Invalid memberAmount' });
  }

  try {
    // Check if the username already exists in the users table
    const usernameCheckResult = await db.query('SELECT * FROM household.users WHERE username = $1', [username]);

    if (usernameCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists in the system' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into users table with the hashed password
    const insertUserResult = await db.query(
      'INSERT INTO household.users (username, password, role, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username',
      [username, hashedPassword, 'user', phone, email]
    );

    const userId = insertUserResult.rows[0].id;

    // Insert property into the property table
    const insertPropertyResult = await db.query(
      "INSERT INTO household.property (city, neighbourhood, address, entrance_id, property_number, floor, area, member_amount, pets, rent, elevator, username, created_by, address_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING property_id",
        [city, neighbourhood, address, entranceId, propertyNumber, floor, area, parsedMemberAmount, pets, rent, isElevatorUsed, username, created_by, address_id]
    );

    if (insertPropertyResult.rows.length > 0) {
      const propertyId = insertPropertyResult.rows[0].property_id;

      // Update the user with the corresponding property_id
      await db.query('UPDATE household.users SET property_id = $1 WHERE id = $2', [propertyId, userId]);

      // Check if the address already exists
      const checkAddressResult = await db.query(
        'SELECT address_id FROM household.address WHERE city = $1 AND address = $2 AND entrance = $3',
        [city, address, entranceId]
      );
    
      let addressId;

      if (checkAddressResult.rows.length > 0) {
        addressId = checkAddressResult.rows[0].address_id;
      } else {
        const insertAddressResult = await db.query(
          'INSERT INTO household.address (city, neighbourhood, address, entrance, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING address_id',
          [city, neighbourhood, address, entranceId, created_by]
        );
    
        addressId = insertAddressResult.rows[0].address_id;
      }

      // Prepare the residents' data (only if residents exist)
      if (residents && residents.length > 0) {
        const residentColumns = [];
        const residentValues = [];

        residents.forEach((resident, index) => {
          const residentIndex = index + 1;
          residentColumns.push(`resident${residentIndex}`, `birthday${residentIndex}`);
          residentValues.push(resident.name, resident.birthday);
        });

        // Construct the dynamic SQL query with placeholders
        const insertResidentsQuery = `
          UPDATE household.property
          SET 
            ${residentColumns.map((col, i) => `${col} = $${i + 1}`).join(', ')}
          WHERE property_id = $${residentColumns.length + 1}
        `;

        // Execute the query, passing all the resident values and propertyId as the last value
        await db.query(insertResidentsQuery, [...residentValues, propertyId]);
      }

      // Send success response
      res.status(201).send({
        city,
        neighbourhood,
        address,
        entranceId,
        propertyNumber,
        floor,
        area,
        memberAmount: parsedMemberAmount,
        pets,
        rent,
        isElevatorUsed,
        username,
        phone,
        created_by,
        email
      });
    } else {
      return res.status(500).json({ error: 'Failed to insert property and get property_id' });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Database error occurred' });
  }
});

router.put('/updateProperty/:id', async (req, res) => {
  const { id } = req.params;
  const { city, neighbourhood, address, floor, area, property_number, member_amount, pets, rent, isElevatorUsed, username, password, email, role, phone,
    resident1, birthday1, resident2, birthday2, resident3, birthday3, resident4, birthday4, 
    resident5, birthday5, resident6, birthday6 } = req.body;

  // Start a transaction
  const updateQueryProperty = `
    UPDATE household.property
    SET city = $1, neighbourhood = $2, address = $3, floor = $4, area = $5, property_number = $6, member_amount = $7, pets = $8, rent = $9, elevator = $10
          resident1 = COALESCE($11, resident1), birthday1 = COALESCE($12, birthday1),
          resident2 = COALESCE($13, resident2), birthday2 = COALESCE($14, birthday2),
          resident3 = COALESCE($15, resident3), birthday3 = COALESCE($15, birthday3),
          resident4 = COALESCE($17, resident4), birthday4 = COALESCE($18, birthday4),
          resident5 = COALESCE($19, resident5), birthday5 = COALESCE($20, birthday5),
          resident6 = COALESCE($21, resident6), birthday6 = COALESCE($22, birthday6)
      WHERE property_id = $23
    RETURNING *;
  `;

  const updateQueryUser = `
    UPDATE household.users
    SET username = $1, password = $2, email = $3, role = $4, phone = $5
    WHERE property_id = $6
    RETURNING *;
  `;

  // Execute the queries within a transaction
  db.query('BEGIN', async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction start failed' });
    }

    // Hash the password if it's provided
    let hashedPassword = password;
    if (password) {
      try {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
      } catch (hashErr) {
        return db.query('ROLLBACK', () => {
          return res.status(500).json({ error: 'Failed to hash password' });
        });
      }
    }

    // Update the property table
    db.query(updateQueryProperty, [
      city, neighbourhood, address, floor, area, property_number, member_amount, pets, rent, isElevatorUsed,
      resident1, birthday1, resident2, birthday2, resident3, birthday3, resident4, birthday4, 
      resident5, birthday5, resident6, birthday6, id
    ], (err, result) => {
      if (err) {
        return db.query('ROLLBACK', () => {
          return res.status(500).json({ error: 'Failed to update property table' });
        });
      }

      // Check if property was found
      if (result.rows.length === 0) {
        return db.query('ROLLBACK', () => {
          return res.status(404).json({ error: 'Property not found' });
        });
      }

      // Update the users table
      db.query(updateQueryUser, [
        username, hashedPassword, email, role, phone, id
      ], (err, result) => {
        if (err) {
          return db.query('ROLLBACK', () => {
            return res.status(500).json({ error: 'Failed to update users table' });
          });
        }

        // Check if user was updated
        if (result.rows.length === 0) {
          return db.query('ROLLBACK', () => {
            return res.status(404).json({ error: 'User not found for this property' });
          });
        }

        // Commit the transaction if everything is successful
        db.query('COMMIT', (err) => {
          if (err) {
            return res.status(500).json({ error: 'Transaction commit failed' });
          }

          // Send back the updated data as the response
          res.status(200).json({
            property: result.rows[0],  // Updated property
            user: result.rows[0]       // Updated user
          });
        });
      });
    });
  });
});

router.put('/updateResident/:id', (req, res) => {
  const { id } = req.params;
  const { residentNumber } = req.body; // residentNumber ще съдържа номера на резидента (1-6)

  // Създаване на динамичен SQL запит за обновяване на полето с NULL
  const updateResidentQuery = `
    UPDATE household.property
    SET resident${residentNumber} = NULL, birthday${residentNumber} = NULL
    WHERE property_id = $1
    RETURNING *;
  `;

  db.query(updateResidentQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update resident' });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Успешно обновяване на резидента
    res.status(200).json({
      message: `Resident ${residentNumber} has been removed`,
      updatedProperty: result.rows[0]
    });
  });
});

router.delete('/deleteProperty/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Property id is required' });
  }

  // First, we delete the property
  db.query('DELETE FROM household.property WHERE property_id = $1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error occurred while deleting property' });
    }

    // If no property is deleted, return an error message
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Property deleted successfully, now delete the associated user
    db.query('DELETE FROM household.users WHERE property_id = $1 RETURNING *', [id], (userErr, userResult) => {
      if (userErr) {
        console.log(userErr);
        return res.status(500).json({ error: 'Error occurred while deleting user' });
      }

      // If no user is deleted, it means no user with the given property_id exists
      if (userResult.rows.length === 0) {
        console.log('No user found associated with this property_id');
      }

      // Send success response with deleted property and user (if deleted)
      res.status(200).json({
        message: 'Property and associated user deleted successfully',
        deletedProperty: result.rows[0],
        deletedUser: userResult.rows.length > 0 ? userResult.rows[0] : null,
      });
    });
  });
});

router.get('/getProperties', async (req, res) => {
  try {
    const { created_by } = req.query;
    let query = "SELECT * FROM household.property";
    const params = [];
    if (created_by) {
      query += " WHERE \"created_by\" = $1";
      params.push(created_by);
    }
    const result = await db.query(query, params);
    res.send(result.rows);
  } catch (err) {
    console.error('Query error:', err.stack);
    res.status(500).json({ error: 'Error occurred', details: err.message });
  }
});

router.get('/getAllPropertiesPerUser', async (req, res) => {
  try {
    // Get the username from the request (you can extract it from req.query, req.body, or req.user if you're using authentication)
    const { created_by } = req.query;

    if (!created_by) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Query the database for addresses where 'created_by' matches the username
    const query = 'SELECT * FROM household.address WHERE created_by = $1';
    const result = await db.query(query, [created_by]);

    // If no addresses are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No properties found for this user' });
    }

    // Return the list of addresses as a response
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'An error occurred while fetching the properties' });
  }
});

router.get('/getSingleProperty/:id', (req, res) => {
  // The query now joins the property and users table on property_id
  const query = `
    SELECT 
      property.*, 
      users.*
    FROM 
      household.property 
    JOIN 
      household.users 
    ON 
      property.property_id = users.property_id
    WHERE 
      property.property_id = $1
  `;
  
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error occurred' });
    } else {
      // Check if the property exists in the database
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Send the result rows as the response
      res.send(result.rows);
    }
  });
});

module.exports = router;