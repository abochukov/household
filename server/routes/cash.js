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
            SELECT property_number, member_amount, floor, elevator
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

  router.post('/expensessesForAddress', async(req, res) => {

    const { 
      address_id, cleaner, elevatorSubscription, elevatorElectricity, lighting, reconstruction, security, garden, other, month, year
    } = req.body;

    const currentTimestamp = new Date();

    try {
      const insertUserResult = await db.query(
        'INSERT INTO household.expenses (address_id, cleaner, elevator_subscription, elevator_electricity, building_electricity, reconstruction, security, garden_maintance, other, created_at, modified_at, month, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING expenses_id',
        [address_id, cleaner, elevatorSubscription, elevatorElectricity, lighting, reconstruction, security, garden, other, currentTimestamp, currentTimestamp, month, year]
      );

      res.status(201).send({
        address_id,
        cleaner,
        elevatorSubscription,
        elevatorElectricity,
        lighting,
        reconstruction,
        security,
        garden,
        other,
        month,
        year
      });
    } catch (error) {
        console.error('Error creating expenses:', error);
        res.status(500).json({message: 'Internal server error'});
    }
  });

  router.post('/monthlyExpensesForSingleProperty', async (req, res) => {
  const monthlyExpenses = req.body; 

  const currentTimestamp = new Date();

  try {
    await db.query('BEGIN');

    for (const expense of monthlyExpenses) {
      const {
        property_number,
        month,
        year,
        total_amount,
        address_id
      } = expense;

      const currentDate = new Date();

      await db.query(
        `INSERT INTO household.charge 
          (property_id, charge_month, charge_year, price, is_paid, date, address_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [property_number, month, year, total_amount, false, currentDate, address_id]
      );
    }

    await db.query('COMMIT');

    res.status(201).json({ message: 'Monthly expenses for properties saved successfully.' });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error saving monthly expenses for properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/reports', async (req, res) => {
    const { address_id, charge_month, charge_year } = req.query;
  console.log(req.query)
    try {
        const result = await db.query(
            `SELECT * FROM household.charge 
             WHERE  address_id = $1
             AND charge_month = $2 
             AND charge_year = $3`,
            [address_id, charge_month, charge_year]
        );
        console.log(result.rows)
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching charges:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/expensessesForAddresss', async (req, res) => {
  const addressId = req.query.address;

  try {
      const query = `
          SELECT *
          FROM household.expenses
          WHERE address_id = $1
      `;

      const result = await db.query(query, [addressId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No expenses found' });
      }

      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;