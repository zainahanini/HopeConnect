const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('./user.model');
const Orphanage = require('./orphanage.model');

const OrphanageReview = db.define('OrphanageReview', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'orphanage_reviews'
});

// Relationships
OrphanageReview.belongsTo(User, { foreignKey: 'user_id' });
OrphanageReview.belongsTo(Orphanage, { foreignKey: 'orphanage_id' });

module.exports = OrphanageReview;