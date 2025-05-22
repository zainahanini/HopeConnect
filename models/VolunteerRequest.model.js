const { DataTypes } = require('sequelize');
const db = require('../config/db');

const VolunteerRequest = db.define('VolunteerRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orphanageId: {
    type: DataTypes.INTEGER,
    field: 'orphanage_id',
    allowNull: true,
    references: {
      model: 'orphanages',
      key: 'id'
    }
  },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  requestType: {
    type: DataTypes.ENUM('teaching', 'mentoring', 'healthcare', 'other'),
    allowNull: false,
    field: 'request_type'
  },
  dateRequested: {
    type: DataTypes.DATE,
    field: 'date_requested',
    allowNull: true
  }
}, {
  tableName: 'volunteer_requests',
  timestamps: false,
});

module.exports = VolunteerRequest;
