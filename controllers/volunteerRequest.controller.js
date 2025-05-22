const VolunteerRequest = require('../models/volunteerRequest.model');

exports.createRequest = async (req, res) => {
  try {
    const request = await VolunteerRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const requests = await VolunteerRequest.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
