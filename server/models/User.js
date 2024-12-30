// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/household'); // Adjust your DB credentials

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// sequelize.sync();

// Define the User model
const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure the username is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // The password field cannot be null
  },
}, {
  timestamps: true, // Optional, to keep track of createdAt/updatedAt
  // freezeTableName: true,
  tableName: 'users',
  schema: 'household'
});

module.exports = User;
