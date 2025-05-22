const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('donor', 'sponsor', 'volunteer', 'orphanage_staff', 'admin','driver'), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'users'
});

module.exports = User;
