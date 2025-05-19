
const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');
const Orphan = require('./orphan.model');

const Donation = db.define('Donation', {
  amount: DataTypes.FLOAT,
  donation_type: DataTypes.ENUM('money', 'clothes', 'food', 'education_materials'),
  category: DataTypes.ENUM('general_fund', 'education_support', 'medical_aid', 'emergency_support'),
  impact_message: DataTypes.TEXT,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

Donation.belongsTo(User, { foreignKey: 'user_id', as: 'donor' });

module.exports = Donation;