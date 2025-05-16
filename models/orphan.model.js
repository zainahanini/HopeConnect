const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Orphan = db.define('Orphan', {
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  education_status: { type: DataTypes.TEXT },
  health_condition: { type: DataTypes.TEXT },
  orphanage_id: { type: DataTypes.INTEGER }
}, {
  timestamps: false,
  tableName: 'orphans'
});

module.exports = Orphan;
