const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');

const createAddress = require('./routes/address');
const deleteAddress = require('./routes/address');

const createProperty = require('./routes/property');
const updateProperty = require('./routes/property');
const updateResident = require('./routes/property');
const deleteProperty = require('./routes/property');
const getProperties = require('./routes/property');
const getAllPropertiesPerUser = require('./routes/property');
const getSingleProperty = require('./routes/property');
const allResidentsForAddress = require('./routes/cash');

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


app.use('/login', loginRoute);
app.use('/signup', signupRoute);

app.use('/api', createAddress);
app.use('/api', deleteAddress);

app.use('/api', createProperty);
app.use('/api', updateProperty);
app.use('/api', updateResident);
app.use('/api', deleteProperty);
app.use('/api', getProperties);
app.use('/api', getAllPropertiesPerUser);
app.use('/api', getSingleProperty);

app.use('/api', allResidentsForAddress);

app.get('/api', (req, res) => {
  res.json({message: 'hello from server'})
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
