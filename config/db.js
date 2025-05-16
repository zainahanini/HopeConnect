const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('HopeConnect', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
