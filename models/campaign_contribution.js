const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contribution = sequelize.define('campaign_contribution', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  contributed_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,        
  tableName: 'campaign_contributions', 
});

module.exports = Contribution;
