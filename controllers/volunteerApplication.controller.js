const VolunteerApplication = require('../models/volunteerApplication.model');



exports.createApplication = async (req, res) => {
  try {
    const application = await VolunteerApplication.create({
      volunteerId: req.user.id,
      requestId: req.body.requestId
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listApplications = async (req, res) => {
  try {
    const apps = await VolunteerApplication.findAll();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
