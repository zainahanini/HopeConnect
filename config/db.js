const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hopeconnect', 'postgres', 'yourpassword', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
