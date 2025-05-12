const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');

const Orphan = db.define('Orphan', {
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  healthStatus: DataTypes.STRING,
  educationStatus: DataTypes.STRING
});

Orphan.belongsTo(User, { as: 'sponsor', foreignKey: 'sponsorId' });

module.exports = Orphan;
