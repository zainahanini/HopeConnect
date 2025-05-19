const Volunteer = require('../models/volunteer.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');

exports.createVolunteer = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { phone, availability, serviceIds } = req.body;

  
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'volunteer') {
      return res.status(400).json({ message: 'Only users with role "volunteer" can register as a volunteer.' });
    }

   
    const exists = await Volunteer.findOne({ where: { userId } });
    if (exists) {
      return res.status(400).json({ message: 'Volunteer profile already exists for this user.' });
    }

   
    const volunteer = await Volunteer.create({ userId, phone, availability });

   
    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      console.log('serviceIds before setServices:', serviceIds);

      await volunteer.setServices(serviceIds);
      const services = await volunteer.getServices();
console.log('Linked services:', services);
console.log('Received serviceIds:', serviceIds);

    }

   
    const result = await Volunteer.findByPk(volunteer.id, {
  include: [
    { model: User, as: 'user', attributes: ['full_name', 'email', 'role'] },
    { model: Service, attributes: ['id', 'name'] }
  ]
});


    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
