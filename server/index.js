const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// const db  = mysql.createPool({
//   connectionLimit : 10,
//   host            : 'localhost',
//   user            : 'postgres', //postgres, port 5432
//   password        : '1234',
//   database        : 'household'
// });

const db = new Pool({
  host: 'localhost',            // Database host (localhost for local machine)
  port: 5432,                  // PostgreSQL default port
  user: 'postgres',            // Your PostgreSQL username
  password: 'postgres',            // Your PostgreSQL password
  database: 'household',       // Your database name
  max: 10,                     // Maximum number of connections in the pool
});

// app.get('/', (req, res) => {
//   db.query("iNSERT INTO test (username, password) VALUES ('userish', '123')", (err, result) =>{
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(result)
//     }
//   })
// });

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  db.query("iNSERT INTO test (username, password) VALUES (?, ?)", [username, password], (err, result) =>{
    if (err) {
      console.log(err)
    } else {
      res.send({username, password})
    }
  })
});

app.post('/createProperty', (req, res) => {

  const entranceId = req.body.entranceId;
  const propertyNumber = req.body.propertyNumber;
  const floor = req.body.floor;
  const area = req.body.area;
  const memberAmount = parseInt(req.body.memberAmount, 10);
  const pets = req.body.pets;
  const rent = req.body.rent;
  
  db.query("iNSERT INTO property (entrance_id, property_number, floor, area, member_amount, pets, rent) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [entranceId, propertyNumber, floor, area, memberAmount, pets, rent], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send({entranceId, propertyNumber, floor, area, memberAmount, pets, rent})
    }
  })
});

app.get('/getProperties', (req, res) => {
  db.query("SELECT * FROM property", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
});


app.get('/api', (req, res) => {
  res.json({message: 'hello from server'})
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
