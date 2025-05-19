const VolunteerApplication = require('../models/volunteerApplication.model');

exports.createApplication = async (req, res) => {
  try {
    const { requestId } = req.body;
    const volunteerId = req.user.id;

    // Check if application already exists
    const existing = await VolunteerApplication.findOne({
      where: { volunteerId, requestId }
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this request.' });
    }

    const application = await VolunteerApplication.create({ volunteerId, requestId });
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
