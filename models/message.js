const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  

const Message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sponsor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orphan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sender: {
    type: DataTypes.ENUM('sponsor', 'orphan'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  sent_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'messages',
});

module.exports = Message;
