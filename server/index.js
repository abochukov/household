const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');

// Example using Express and JWT  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


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

  app.post('/createProperty', async (req, res) => {
    const { 
      city, address, entranceId, propertyNumber, floor, area, memberAmount, pets, rent, username, created_by, phone, email, residents
    } = req.body;
  
    // Validate required fields
    if (!city || !address || !entranceId || !propertyNumber || !floor || !area || !memberAmount || !rent || !username || !phone) {
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
  
      // Insert user into users table
      const insertUserResult = await db.query(
        'INSERT INTO household.users (username, password, role, phone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id, username',
        [username, '1', 'user', phone, email]
      );
  
      const userId = insertUserResult.rows[0].id;  // Get the inserted user's ID
  
      // Insert property into the property table
      const insertPropertyResult = await db.query(
        "INSERT INTO household.property (city, address, entrance_id, property_number, floor, area, member_amount, pets, rent, username, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING property_id",
        [city, address, entranceId, propertyNumber, floor, area, parsedMemberAmount, pets, rent, username, created_by]
      );
  
      if (insertPropertyResult.rows.length > 0) {
        const propertyId = insertPropertyResult.rows[0].property_id;
  
        // Update the user with the corresponding property_id
        await db.query(
          'UPDATE household.users SET property_id = $1 WHERE id = $2',
          [propertyId, userId]
        );
  
        // Step 1: Check if the address already exists
        const checkAddressResult = await db.query(
          'SELECT address_id FROM household.address WHERE city = $1 AND address = $2 AND entrance = $3',
          [city, address, entranceId]
        );
    
        let addressId;
    
        if (checkAddressResult.rows.length > 0) {
          // Address already exists, get the address_id
          addressId = checkAddressResult.rows[0].address_id;
        } else {
          // Address doesn't exist, insert it into the address table
          const insertAddressResult = await db.query(
            'INSERT INTO household.address (city, address, entrance, created_by) VALUES ($1, $2, $3, $4) RETURNING address_id',
            [city, address, entranceId, created_by]
          );
    
          addressId = insertAddressResult.rows[0].address_id;
        }
  
        // Step 2: Insert residents into the property table
        const residentsData = [];
        const residentColumns = [];
        const residentValues = [];
  
        // Loop through the residents and prepare the query data
        residents.forEach((resident, index) => {
          const residentIndex = index + 1;  // To match the column names like resident1, resident2, etc.
          residentColumns.push(`resident${residentIndex}`, `birthday${residentIndex}`);
          residentValues.push(resident.name, resident.birthday);
        });
  
        // Build the SQL query to insert the residents into the property table
        const insertResidentsQuery = `
          UPDATE household.property
          SET (${residentColumns.join(', ')}) = (${residentValues.map((_, i) => `$${i + 1}`).join(', ')})
          WHERE property_id = $${residentColumns.length + 1}
        `;
  
        await db.query(insertResidentsQuery, [...residentValues, propertyId]);
  
        // Send success response
        res.status(201).send({
          city,
          address,
          entranceId,
          propertyNumber,
          floor,
          area,
          memberAmount: parsedMemberAmount,
          pets,
          rent,
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
  

app.put('/updateProperty/:id', (req, res) => {
  const { id } = req.params;
  const { city, address, floor, area, member_amount, pets, rent, username, email, role, phone } = req.body;

  // Start a transaction
  const updateQueryProperty = `
    UPDATE household.property
    SET city = $1, address = $2, floor = $3, area = $4, member_amount = $5, pets = $6, rent = $7
    WHERE property_id = $8
    RETURNING *;
  `;

  const updateQueryUser = `
    UPDATE household.users
    SET username = $1, email = $2, role = $3, phone = $4
    WHERE property_id = $5
    RETURNING *;
  `;

  // Execute the queries within a transaction
  db.query('BEGIN', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction start failed' });
    }

    // Update the property table
    db.query(updateQueryProperty, [
      city, address, floor, area, member_amount, pets, rent, id
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
        username, email, role, phone, id
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


app.delete('/deleteProperty/:id', (req, res) => {
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


app.get('/getProperties', (req, res) => {
  const {created_by} = req.query;

  let query = "SELECT * FROM household.property";
  const params = [];

  if(created_by) {
    query += " WHERE \"created_by\" = $1"; // Филтриране по колоната created_by
    params.push(created_by);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error occurred' });
    } else {
      res.send(result.rows);
    }
  });
});

app.get('/getAllPropertiesPerUser', async (req, res) => {
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


app.get('/getSingleProperty/:id', (req, res) => {
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


// Use the login route
app.use('/login', loginRoute);
app.use('/signup', signupRoute);


app.get('/api', (req, res) => {
  res.json({message: 'hello from server'})
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
