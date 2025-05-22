
const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');


const Donation = db.define('Donation', {
  amount: DataTypes.FLOAT,
  donation_type: DataTypes.ENUM('money', 'clothes', 'food', 'education_materials'),
  category: DataTypes.ENUM('general_fund', 'education_support', 'medical_aid', 'emergency_support'),
  impact_message: DataTypes.TEXT,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fee: {
  type: DataTypes.FLOAT,
  allowNull: true, 
},
total: {
  type: DataTypes.FLOAT,
  allowNull: true,
},

project_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
 donor_lat: {
   type: DataTypes.DOUBLE },
  donor_lng: {
     type: DataTypes.DOUBLE },
  assigned_agent_id:
   { type: DataTypes.INTEGER },
   delivery_distance:{
    type: DataTypes.STRING
   },
   delivery_status: {
  type: DataTypes.ENUM('pending_pickup', 'en_route', 'delivered'),
  defaultValue: 'pending_pickup'
}

}, {
  timestamps: false
});

Donation.belongsTo(User, { foreignKey: 'user_id', as: 'donor' });

module.exports = Donation;