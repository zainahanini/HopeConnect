const Volunteer = require('../models/volunteer.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');
exports.createVolunteer = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { phone, availability, serviceIds } = req.body;

    if (!phone || !availability) {
      return res.status(400).json({ message: 'Phone and availability are required.' });
    }

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'volunteer') {
      return res.status(400).json({ message: 'Only users with role "volunteer" can register as a volunteer.' });
    }

    const exists = await Volunteer.findOne({ where: { userId } });
    if (exists) {
      return res.status(400).json({ message: 'Volunteer profile already exists for this user.' });
    }

    const volunteer = await Volunteer.create({ userId, phone, availability });
console.log('Received serviceIds:', serviceIds);

   if (Array.isArray(serviceIds) && serviceIds.length > 0) {
  const validServices = await Service.findAll({
    where: { id: serviceIds }
  });

  if (validServices.length !== serviceIds.length) {
    return res.status(400).json({ message: 'One or more service IDs are invalid.' });
  }

  await volunteer.setServices(serviceIds);
}


    const result = await Volunteer.findByPk(volunteer.id, {
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'role'] },
        { model: Service, attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Volunteer creation failed:', error);
    res.status(500).json({ error: error.message });
  }
};
