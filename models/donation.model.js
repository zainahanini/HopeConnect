const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');
const Orphan = require('./orphan.model');

const Donation = db.define('Donation', {
  amount: DataTypes.FLOAT,
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Donation.belongsTo(User, { as: 'donor' });
Donation.belongsTo(Orphan, { as: 'orphan', allowNull: true });

module.exports = Donation;
