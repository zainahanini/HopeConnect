const Donation = require('../models/donation.model');
const DeliveryAgent = require('../models/deliveryAgent.model');
const axios = require('axios');
const  User = require('../models/user.model');
const bcrypt = require('bcrypt');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


exports.createDriver = async (req, res) => {
  try {
    const { user_id, current_lat, current_lng } = req.body;

    if (!user_id || current_lat == null || current_lng == null) {
      return res.status(400).json({ message: 'user_id, current_lat, and current_lng are required' });
    }

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'driver') {
      return res.status(403).json({ message: 'User does not have the driver role' });
    }

    const existingAgent = await DeliveryAgent.findOne({ where: { user_id } });
    if (existingAgent) {
      return res.status(409).json({ message: 'User is already registered as a delivery agent' });
    }

    const agent = await DeliveryAgent.create({
      user_id,
      current_lat,
      current_lng,
      is_available: true,
    });

    res.status(201).json({ message: 'Driver agent created successfully', agent });
  } catch (err) {
    console.error('createDriver error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.assignNearestAgent = async (req, res) => {
  const { donationId } = req.params;

  try {
    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donation_type === 'money') {
      return res.status(400).json({ message: 'No agent needed for monetary donations' });
    }

    const agents = await DeliveryAgent.findAll({ where: { is_available: true } });
    if (!agents.length) {
      return res.status(400).json({ message: 'No available agents at the moment' });
    }

    const origin = `${donation.donor_lat},${donation.donor_lng}`;
    const destinations = agents.map(a => `${a.current_lat},${a.current_lng}`).join('|');

    const distanceMatrixURL = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    const response = await axios.get(distanceMatrixURL, {
      params: {
        origins: origin,
        destinations,
        key: GOOGLE_API_KEY,
      }
    });

    const distances = response.data.rows[0].elements.map((el, i) => ({
      agent: agents[i],
      distanceValue: el.distance?.value || Number.MAX_SAFE_INTEGER, 
      distanceText: el.distance?.text || 'Unknown'
    }));

    const nearest = distances.reduce((prev, curr) =>
      curr.distanceValue < prev.distanceValue ? curr : prev
    );

    if (!nearest.agent) {
      return res.status(400).json({ message: 'Unable to assign an agent' });
    }


    donation.assigned_agent_id = nearest.agent.id;
    donation.delivery_distance = nearest.distanceValue / 1000; 
    await donation.save();

    nearest.agent.is_available = false;
    await nearest.agent.save();

    res.status(200).json({
      message: 'Nearest agent assigned successfully',
      agentId: nearest.agent.id,
      donationId: donation.id,
      distance_km: (nearest.distanceValue / 1000).toFixed(2),
    });

  } catch (err) {
    console.error('Error assigning agent:', err.message);
    res.status(500).json({ message: 'Failed to assign delivery agent', error: err.message });
  }
};


exports.updateAgentLocation = async (req, res) => {
  try {
    const { current_lat, current_lng } = req.body;

    const agent = await DeliveryAgent.findOne({ where: { user_id: req.user.id } });
    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    agent.current_lat = current_lat;
    agent.current_lng = current_lng;
    await agent.save();

    res.json({ message: 'Agent location updated successfully', agent });
  } catch (err) {
    console.error('Error updating location:', err.message);
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
};


exports.trackDonation = async (req, res) => {
  try {
    const { donationId } = req.params;

    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (!donation.assigned_agent_id) {
      return res.status(400).json({ message: 'No delivery agent assigned for this donation yet' });
    }

    const agent = await DeliveryAgent.findByPk(donation.assigned_agent_id);
    if (!agent) {
      return res.status(404).json({ message: 'Assigned delivery agent not found' });
    }

    res.json({
      agentId: agent.id,
      currentLocation: {
        lat: agent.current_lat,
        lng: agent.current_lng
      },
      is_available: agent.is_available
    });
  } catch (err) {
    console.error('Error tracking donation:', err.message);
    res.status(500).json({ message: 'Failed to track donation', error: err.message });
  }
};
// Get current location of a specific delivery agent by ID
exports.getAgentLocation = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await DeliveryAgent.findByPk(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    res.json({
      agentId: agent.id,
      currentLocation: {
        lat: agent.current_lat,
        lng: agent.current_lng
      },
      is_available: agent.is_available
    });
  } catch (err) {
    console.error('Error fetching agent location:', err.message);
    res.status(500).json({ message: 'Failed to get agent location', error: err.message });
  }
};
// Get current location of a specific delivery agent by ID
exports.getAgentLocation = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await DeliveryAgent.findByPk(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    res.json({
      agentId: agent.id,
      currentLocation: {
        lat: agent.current_lat,
        lng: agent.current_lng
      },
      is_available: agent.is_available
    });
  } catch (err) {
    console.error('Error fetching agent location:', err.message);
    res.status(500).json({ message: 'Failed to get agent location', error: err.message });
  }
};
