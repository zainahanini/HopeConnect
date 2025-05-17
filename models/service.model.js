const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Service = db.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, {
  tableName: 'services',
  timestamps: false,
});

module.exports = Service;
