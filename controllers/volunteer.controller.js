const Volunteer = require('HopeConnect\models\volunteer.model.js');

exports.registerVolunteer = async (req, res) => {
  const volunteer = await Volunteer.create(req.body);
  res.status(201).json(volunteer);
};

exports.getAllVolunteers = async (req, res) => {
  const volunteers = await Volunteer.findAll({ include: 'User' });
  res.json(volunteers);
};
