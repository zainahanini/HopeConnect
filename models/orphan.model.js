const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Orphan = db.define('Orphan', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  full_name: { type: DataTypes.STRING(100), allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  education_status: { type: DataTypes.TEXT },
  health_condition: { type: DataTypes.TEXT },
  orphanage_id: { type: DataTypes.INTEGER }
}, {
  timestamps: false,
  tableName: 'orphans'
});

Orphan.associate = (models) => {
  Orphan.hasMany(models.OrphanUpdate, { foreignKey: 'orphan_id' });
};

module.exports = Orphan;
