const Donation = require('../models/donation.model');
const DeliveryAgent = require('../models/deliveryAgent.model');
const axios = require('axios');
const  User = require('../models/user.model');
const bcrypt = require('bcrypt');
const GOOGLE_API_KEY = process.env.API_KEY;

exports.createDriver = async (req, res) => {
  try {
    const { user_id, current_lat, current_lng } = req.body;

    if (!user_id || current_lat == null || current_lng == null) {
      return res.status(400).json({ message: 'user_id, current_lat, and current_lng are required' });
    }

    const user = await User.findByPk(user_id);
    if (!user || user.role !== 'driver') {
      return res.status(403).json({ message: 'Invalid or unauthorized user' });
    }

    const existingAgent = await DeliveryAgent.findOne({ where: { user_id } });
    if (existingAgent) {
      return res.status(409).json({ message: 'User is already a delivery agent' });
    }

    const agent = await DeliveryAgent.create({
      user_id,
      current_lat,
      current_lng,
      is_available: true,
    });

    res.status(201).json({ message: 'Delivery agent created', agent });
  } catch (err) {
    console.error('createDriver error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
exports.updateAgentLocation = async (req, res) => {
  try {
    const { current_lat, current_lng } = req.body;
    const userId = req.user.id;

    const agent = await DeliveryAgent.findOne({ where: { user_id: userId } });
    if (!agent) return res.status(404).json({ message: 'Delivery agent not found' });

    agent.current_lat = current_lat;
    agent.current_lng = current_lng;
    await agent.save();

    res.json({ message: 'Agent location updated', agent });
  } catch (err) {
    console.error('updateAgentLocation error:', err);
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
};
exports.trackDonation = async (req, res) => {
  try {
    const { donationId } = req.params;

    const donation = await Donation.findByPk(donationId);
    if (!donation || !donation.assigned_agent_id) {
      return res.status(404).json({ message: 'No assigned agent for this donation' });
    }

    const agent = await DeliveryAgent.findByPk(donation.assigned_agent_id);
    if (!agent) {
      return res.status(404).json({ message: 'Assigned agent not found' });
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
    console.error('trackDonation error:', err.message);
    res.status(500).json({ message: 'Tracking failed', error: err.message });
  }
};
