
const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');
const Service = require('./service.model'); 



const Volunteer = db.define('Volunteer', {
  phone: DataTypes.STRING,
  availability: DataTypes.STRING,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: false
});

Volunteer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Volunteer.belongsToMany(Service, {
  through: 'volunteer_services', 
  foreignKey: 'volunteer_id',
  otherKey: 'service_id',
  timestamps: false
});

Service.belongsToMany(Volunteer, {
  through: 'volunteer_services',
  foreignKey: 'service_id',
  otherKey: 'volunteer_id',
  timestamps: false
});


module.exports = Volunteer;