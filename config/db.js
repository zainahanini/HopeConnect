const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hopeconnect', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;

