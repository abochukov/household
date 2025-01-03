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
  const { city, address, entranceId, propertyNumber, floor, area, memberAmount, pets, rent, username, created_by } = req.body;

  // Validate required fields
  if (!city || !address || !entranceId || !propertyNumber || !floor || !area || memberAmount === undefined || !rent || !username) {
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

    // If the username already exists, return an error message
    if (usernameCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists in the system' });
    }

    // If the username doesn't exist, insert it into the users table
    const insertUserResult = await db.query(
      'INSERT INTO household.users (username, password) VALUES ($1, 1) RETURNING id, username',
      [username]
    );

    const userId = insertUserResult.rows[0].id;  // Get the inserted user's ID

    // Proceed to insert the property into the property table and get the generated property_id
    const insertPropertyResult = await db.query(
      "INSERT INTO household.property (city, address, entrance_id, property_number, floor, area, member_amount, pets, rent, username, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING property_id",
      [city, address, entranceId, propertyNumber, floor, area, parsedMemberAmount, pets, rent, username, created_by]
    );

    // Debugging: Log the insertPropertyResult to check its structure
    console.log('insertPropertyResult:', insertPropertyResult);

    // Ensure property_id is present
    if (insertPropertyResult.rows.length > 0) {
      const propertyId = insertPropertyResult.rows[0].property_id;  // Get the generated property_id

      // Update the user with the corresponding property_id in the users table
      await db.query(
        'UPDATE household.users SET property_id = $1 WHERE id = $2',
        [propertyId, userId]
      );

      // Send success response with the created property details
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
        created_by
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
  const { city, address, floor, area, member_amount, pets, rent, username } = req.body;


  // if(!city || !address || !floor || !area || !member_amount || !rent || !username) {
  //   return res.status(400).json({error: 'Missing required fields'});
  // }

  const updateQuery = `
  UPDATE household.property
  SET city = $1, address = $2, floor = $3, area = $4, member_amount = $5, pets = $6, rent = $7, username = $8
  WHERE property_id = $9
  RETURNING *;
`;

// Execute the query
db.query(updateQuery, [
  city, address, floor, area, member_amount, pets, rent, username, id
], (err, result) => {
  if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error occurred' });
  }
  
  // Check if the property was found and updated
  if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
  }

  // Send back the updated property data as the response
  res.status(200).json(result.rows[0]);
  });
})


app.get('/getProperties', (req, res) => {
  db.query("SELECT * FROM household.property", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Error occured'})
    } else {
      res.send(result.rows)
    }
  })
});

app.get('/getSingleProperty/:id', (req, res) => {
  db.query('SELECT * FROM household.property WHERE property_id = $1', [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Error occured'})
    } else {
      res.send(result.rows)
    } 
  })
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
