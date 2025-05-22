const Donation = require('../models/donation.model');
const DeliveryAgent = require('../models/deliveryAgent.model');
const User = require('../models/user.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../services/sendEmail');
const axios = require('axios');

const assignNearestAgent = require('../services/agentAssignment');
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

    let fee = 10;
    let total = 10;
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

    // 1. Create the donation first
    const donation = await Donation.create({
      user_id: userId,
      amount,
      donation_type,
      category,
      project_id: project_id || null,
      payment_status: paymentStatus,
      donor_lat,
      donor_lng,
      fee,
      total
    });

    // 2. Assign agent if physical donation
    if (donation_type !== 'money') {
      if (!donor_lat || !donor_lng) {
        return res.status(400).json({ message: 'Location is required for physical donations' });
      }

      const { agent, distanceText, durationText } = await assignNearestAgent(donor_lat, donor_lng);

      if (!agent) {
        return res.status(400).json({ message: 'No available agents found' });
      }

      // 3. Update donation with assignment
      await donation.update({
        assigned_agent_id: agent.user_id, // or agent.id, depending on foreign key
        delivery_distance: distanceText,
        delivery_status: 'Assigned',
      });

      await agent.update({ is_available: false });
    }

    // Send confirmation email
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
exports.assignNearestAgent = async (req, res) => {
  const { donationId } = req.params;

  try {
    const donation = await Donation.findByPk(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.donation_type === 'money') {
      return res.status(400).json({ message: 'Money donations don’t require delivery agents' });
    }
    if (donation.assigned_agent_id) {
      return res.status(409).json({ message: 'Agent already assigned to this donation' });
    }

    const { agent, distanceText, durationText } = await assignNearestAgent(donation.donor_lat, donation.donor_lng);
    if (!agent) return res.status(400).json({ message: 'No available agents found' });

    await donation.update({
      assigned_agent_id: agent.id, 
      delivery_distance: distanceText,
      delivery_status: 'Assigned',
    });

    await agent.update({ is_available: false });

    res.status(200).json({
      message: 'Agent assigned successfully',
      agentId: agent.user_id || agent.id,
      distance: distanceText,
      duration: durationText
    });
  } catch (err) {
    console.error('Agent assignment error:', err);
    res.status(500).json({ message: 'Failed to assign agent', error: err.message });
  }
};

