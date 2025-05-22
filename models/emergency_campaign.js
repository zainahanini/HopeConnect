const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmergencyCampaign = sequelize.define('emergency_campaign', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
}, {
  timestamps: false, 
});

module.exports = EmergencyCampaign;
