const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Orphanage = db.define('Orphanage', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255)
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: false,
  tableName: 'orphanages'
});

module.exports = Orphanage;