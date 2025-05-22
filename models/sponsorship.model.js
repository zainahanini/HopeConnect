const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');
const Orphan = require('./orphan.model');

const Sponsorship = db.define('Sponsorship', {
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'paused', 'cancelled'),
    defaultValue: 'pending' 
  }
}, {
  timestamps: false,
  tableName: 'sponsorships'
});

Sponsorship.belongsTo(User, { foreignKey: 'sponsor_id' });
Sponsorship.belongsTo(Orphan, { foreignKey: 'orphan_id' });

module.exports = Sponsorship;
