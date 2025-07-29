require('dotenv').config({ path: './server/.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const userRoute = require('./routes/user');

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


app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);
app.use('/api/user', userRoute);

app.use('/api', createAddress);
app.use('/api', deleteAddress);

app.use('/api', createProperty);
app.use('/api', updateProperty);
app.use('/api', updateResident);
app.use('/api', deleteProperty);
app.use('/api', getProperties);
app.use('/api', getAllPropertiesPerUser);
app.use('/api', getSingleProperty);
console.log('***');


app.get('/api', (req, res) => {
  res.json({message: 'hello from server'})
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
