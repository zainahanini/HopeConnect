const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.STRING
});

module.exports = User;
