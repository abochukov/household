require('dotenv').config({ path: './server/.env' });

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

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


const isProduction = process.env.NODE_ENV === 'production';
console.log({
  NODE_ENV: process.env.NODE_ENV,
  DB_USER_LOCAL: process.env.DB_USER_LOCAL,
  DB_PASSWORD_LOCAL: process.env.DB_PASSWORD_LOCAL,
  DB_NAME_LOCAL: process.env.DB_NAME_LOCAL,
  DB_HOST_LOCAL: process.env.DB_HOST_LOCAL,
  DB_PORT_LOCAL: process.env.DB_PORT_LOCAL
});
const db = new Pool({
  host: isProduction ? process.env.DB_HOST_PROD : process.env.DB_HOST_LOCAL,
  port: parseInt(isProduction ? process.env.DB_PORT_PROD : process.env.DB_PORT_LOCAL, 10),
  user: String(isProduction ? process.env.DB_USER_PROD : process.env.DB_USER_LOCAL),
  password: String(isProduction ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_LOCAL),
  database: String(isProduction ? process.env.DB_NAME_PROD : process.env.DB_NAME_LOCAL),
  max: 10,
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


app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);

app.use('/api', createAddress);
app.use('/api', deleteAddress);

app.use('/api', createProperty);
app.use('/api', updateProperty);
app.use('/api', updateResident);
app.use('/api', deleteProperty);
app.use('/api', getProperties);
app.use('/api', getAllPropertiesPerUser);
app.use('/api', getSingleProperty);



app.get('/api', (req, res) => {
  res.json({message: 'hello from server'})
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
