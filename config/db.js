const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Hopeconnect', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;

