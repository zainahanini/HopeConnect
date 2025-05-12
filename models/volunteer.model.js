const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');

const Volunteer = db.define('Volunteer', {
  serviceType: DataTypes.STRING,
  description: DataTypes.STRING
});

Volunteer.belongsTo(User);

module.exports = Volunteer;
