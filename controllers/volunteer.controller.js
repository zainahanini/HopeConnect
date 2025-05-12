const Volunteer = require('../../../Desktop/4th year 2nd semester/advanced/hopeconnect-nodejs-pg/models/volunteer.model');

exports.registerVolunteer = async (req, res) => {
  const volunteer = await Volunteer.create(req.body);
  res.status(201).json(volunteer);
};

exports.getAllVolunteers = async (req, res) => {
  const volunteers = await Volunteer.findAll({ include: 'User' });
  res.json(volunteers);
};
