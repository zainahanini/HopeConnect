const Volunteer = require('../models/volunteer.model');
const VolunteerRequest = require('../models/volunteerRequest.model');
const Service = require('../models/service.model');
const { Op } = require('sequelize');

exports.getMatchesForRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await VolunteerRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Volunteer request not found' });
    }

    const requestType = request.requestType;


    const service = await Service.findOne({ where: { name: requestType } });
    if (!service) {
      return res.status(404).json({ message: 'Service type not found' });
    }


    const volunteers = await Volunteer.findAll({
      include: [{
        model: Service,
        where: { id: service.id },
        through: { attributes: [] } 
      }]
    });

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
