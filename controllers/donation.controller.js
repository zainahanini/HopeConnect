const Donation = require('../models/donation.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user.model');
const Project = require('../models/project.model');
const sendEmail = require('../services/sendEmail');

const TRANSACTION_FEE_PERCENTAGE = 2.9;

exports.createDonation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, donation_type, category, payment_method_id, project_id } = req.body;

    const validTypes = ['money', 'clothes', 'food', 'education_materials'];
    const validCategories = ['general_fund', 'education_support', 'medical_aid', 'emergency_support'];

    if (!validTypes.includes(donation_type) || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid donation type or category' });
    }

    let project = null;
    if (project_id) {
      project = await Project.findByPk(project_id);
      if (!project) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
    }

    let fee = 0;
    let total = amount;


    if (donation_type === 'money') {
      if (!payment_method_id) {
        return res.status(400).json({ message: "Payment method ID is required for money donations" });
      }

      fee = parseFloat((amount * TRANSACTION_FEE_PERCENTAGE / 100).toFixed(2));
      total = parseFloat((amount + fee).toFixed(2));

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'usd',
        payment_method: payment_method_id,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment failed" });
      }
    }

    const donation = await Donation.create({
      user_id: userId,
      amount,
      donation_type,
      category,
      fee,
      total,
      project_id
    });

    const user = await User.findByPk(userId);

    if (user?.email) {
      const htmlContent = `
        <h2>Thank you for your donation!</h2>
        <p><strong>Amount Donated:</strong> $${amount}</p>
        <p><strong>Transaction Fee:</strong> $${fee}</p>
        <p><strong>Total Charged:</strong> $${total}</p>
        <p><strong>Type:</strong> ${donation_type}</p>
        <p><strong>Category:</strong> ${category}</p>
        ${project ? `<p><strong>Project:</strong> ${project.title}</p>` : ''}
        <p>Your donation helps us support those in need. We appreciate your kindness!</p>
      `;

      await sendEmail(user.email, 'Donation Confirmation', htmlContent);
    }

    res.status(201).json({ message: 'Donation recorded successfully', donation });

  } catch (err) {
    console.error('Donation creation error:', err.message);
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

    if (impact_message === undefined || impact_message === null) {
      return res.status(400).json({ message: 'Impact message is required' });
    }

    const donation = await Donation.findByPk(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.impact_message = impact_message;
    await donation.save();

    const user = await User.findByPk(donation.user_id);

    if (user?.email) {
      const htmlContent = `
        <h2>Donation Impact Update</h2>
        <p>Dear ${user.full_name || 'Donor'},</p>
        <p>Thank you once again for your generous donation.</p>
        <p><strong>Impact Message:</strong> ${impact_message}</p>
        <p>Your support is making a difference!</p>
      `;

      await sendEmail(user.email, 'Your Donation Impact Update', htmlContent);
    }

    res.json({ message: 'Impact message updated and email sent', donation });
  } catch (err) {
    console.error('Update impact message error:', err);
    res.status(500).json({ message: 'Failed to update donation', error: err.message });
  }
};
