const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DeliveryAgent = sequelize.define('delivery_agents', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  current_lat: { type: DataTypes.DOUBLE },
  current_lng: { type: DataTypes.DOUBLE },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: false
});

module.exports = DeliveryAgent;