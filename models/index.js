const db = {};
const Sequelize = require('sequelize');
const sequelize = new Sequelize(require('../config/db'));

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize);
db.Volunteer = require('./volunteer.model')(sequelize);
db.Service = require('./service.model')(sequelize);
db.Project=require('./project.model')(sequelize);

db.Volunteer.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

db.Volunteer.belongsToMany(db.Service, {
  through: 'volunteer_services',
  foreignKey: 'volunteer_id',
  otherKey: 'service_id',
  timestamps: false
});

db.Service.belongsToMany(db.Volunteer, {
  through: 'volunteer_services',
  foreignKey: 'service_id',
  otherKey: 'volunteer_id',
  timestamps: false
});
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); 
  }
});

module.exports = db;
