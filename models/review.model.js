const { DataTypes } = require('sequelize');
const db = require('../config/db');
const User = require('../models/user.model');
const Project = require('../models/project.model');
  const Review = db.define('Review', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
 },
    {
  timestamps: false

});


  Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Project, { foreignKey: 'project_id' });

module.exports=Review;

