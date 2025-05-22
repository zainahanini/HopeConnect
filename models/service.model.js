
const { DataTypes } = require('sequelize');
const db = require('../config/db');


const Service = db.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true }
}, {
  tableName: 'services',
  timestamps: false,
});

Service.associate = (models) => {
  Service.belongsToMany(models.Volunteer, {
    through: 'volunteer_services',
    foreignKey: 'service_id',
    otherKey: 'volunteer_id',
    timestamps: false
  });
};

module.exports = Service;



