const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Project = db.define('Project', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_description: {
    type: DataTypes.TEXT,
  },
  permalink: {
    type: DataTypes.STRING,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  donations_prohibited: {
    type: DataTypes.BOOLEAN,
  },
  organization_name: {
    type: DataTypes.STRING,
  },
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  location:DataTypes.STRING
}, {
  tableName: 'projects',
  timestamps: true,
    createdAt: 'start_date',
  updatedAt: 'end_date'
});

module.exports = Project;
