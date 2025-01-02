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

app.post('/createProperty', (req, res) => {
  const { entranceId, propertyNumber, floor, area, memberAmount, pets, rent } = req.body;

  // Validate required fields
  if (!entranceId || !propertyNumber || !floor || !area || memberAmount === undefined || !rent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate memberAmount is a number
  const parsedMemberAmount = parseInt(memberAmount, 10);
  if (isNaN(parsedMemberAmount)) {
    return res.status(400).json({ error: 'Invalid memberAmount' });
  }

  // Perform database insertion
  db.query(
    "INSERT INTO household.property (entrance_id, property_number, floor, area, member_amount, pets, rent) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
    [entranceId, propertyNumber, floor, area, parsedMemberAmount, pets, rent],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error occurred' });
      } else {
        // Send response with the created property details
        res.status(201).send({
          entranceId,
          propertyNumber,
          floor,
          area,
          memberAmount: parsedMemberAmount,
          pets,
          rent,
        });
      }
    }
  );
});


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
