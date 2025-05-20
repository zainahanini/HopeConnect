const VolunteerApplication = require('../models/volunteerApplication.model');

exports.createApplication = async (req, res) => {
  try {
    const { requestId } = req.body;
    const volunteerId = req.user.id;

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

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "approved" or "rejected".' });
    }

    const application = await VolunteerApplication.findByPk(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application ${status} successfully.`, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
