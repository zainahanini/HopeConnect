const { DataTypes } = require('sequelize');
const db = require('../config/db');

const VolunteerApplication = db.define('VolunteerApplication', {
  volunteerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'volunteer_id'
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'request_id'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  appliedAt: {
    type: DataTypes.DATE,
    field: 'applied_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'volunteer_applications',
  timestamps: false
});

module.exports = VolunteerApplication;
