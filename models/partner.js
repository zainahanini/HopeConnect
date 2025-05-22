const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Partner = sequelize.define('partner', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {  
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  api_endpoint: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Partner;
