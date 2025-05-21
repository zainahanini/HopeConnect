const Donation = require('../models/donation.model');
const DeliveryAgent = require('../models/deliveryAgent.model');
const User = require('../models/user.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../services/sendEmail');
const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

async function assignNearestAgent(donorLat, donorLng) {
  const agents = await DeliveryAgent.findAll({ where: { is_available: true } });
  if (agents.length === 0) return null;

  const destinations = agents.map(agent => `${agent.current_lat},${agent.current_lng}`).join('|');
  const origin = `${donorLat},${donorLng}`;

  const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
    params: {
      origins: origin,
      destinations,
      key: GOOGLE_API_KEY,
    },
  });

  const distances = response.data.rows[0].elements;
  let minIndex = 0;
  let minDistance = distances[0].distance?.value || Number.MAX_SAFE_INTEGER;

  for (let i = 1; i < distances.length; i++) {
    if (distances[i].distance?.value < minDistance) {
      minDistance = distances[i].distance.value;
      minIndex = i;
    }
  }

  return agents[minIndex];
}

exports.createDonation = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      amount,
      donation_type,
      category,
      payment_method_id,
      project_id,
      donor_lat,
      donor_lng
    } = req.body;

    const validTypes = ['money', 'clothes', 'food', 'education_materials'];
    const validCategories = ['general_fund', 'education_support', 'medical_aid', 'emergency_support'];

    if (!validTypes.includes(donation_type) || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid donation type or category' });
    }

    let fee = 0;
    let total = amount;
    let paymentStatus = 'pending';

    if (donation_type === 'money') {
      if (!payment_method_id) {
        return res.status(400).json({ message: "Payment method ID is required for money donations" });
      }

      fee = +(amount * 0.05).toFixed(2);
      total = +(amount + fee).toFixed(2);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'usd',
        payment_method: payment_method_id,
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      });

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment failed" });
      }

      paymentStatus = 'paid';
    }

    let assignedAgentId = null;
    if (donation_type !== 'money') {
      if (!donor_lat || !donor_lng) {
        return res.status(400).json({ message: 'Location is required for physical donations' });
      }

      const agent = await assignNearestAgent(donor_lat, donor_lng);
      if (agent) {
        assignedAgentId = agent.id;
        agent.is_available = false;
        await agent.save();
      }
    }

    const donation = await Donation.create({
      user_id: userId,
      amount,
      donation_type,
      category,
      project_id: project_id || null,
      payment_status: paymentStatus,
      assigned_agent_id: assignedAgentId,
      donor_lat,
      donor_lng,
      fee:10,
      total:10
    });

    const user = await User.findByPk(userId);
    if (user?.email) {
      const htmlContent = `
        <h2>Thank you for your donation!</h2>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Total Charged:</strong> $${total} (including $${fee} operational fee)</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Type:</strong> ${donation_type}</p>
        ${donation_type !== 'money' ? `<p>Your assigned delivery agent will contact you soon.</p>` : ''}
      `;

      await sendEmail(user.email, 'Donation Confirmation', htmlContent);
    }

    res.status(201).json({ message: 'Donation recorded successfully', donation });
  } catch (err) {
    console.error('Donation creation error:', err);
    res.status(500).json({ message: 'Failed to create donation', error: err.message });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({ where: { user_id: req.user.id } });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch donations', error: err.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all donations', error: err.message });
  }
};

exports.updateImpactMessage = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { impact_message } = req.body;

    if (!impact_message) return res.status(400).json({ message: 'Impact message is required' });

    const donation = await Donation.findByPk(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.impact_message = impact_message;
    await donation.save();

    const user = await User.findByPk(donation.user_id);
    if (user?.email) {
      const htmlContent = `
        <h2>Donation Impact Update</h2>
        <p>Dear ${user.full_name || 'Donor'},</p>
        <p><strong>Impact Message:</strong> ${impact_message}</p>
        <p>Thank you once again for your support.</p>
      `;
      await sendEmail(user.email, 'Your Donation Impact Update', htmlContent);
    }

    res.json({ message: 'Impact message updated and email sent', donation });
  } catch (err) {
    console.error('Update impact message error:', err);
    res.status(500).json({ message: 'Failed to update donation', error: err.message });
  }
};
