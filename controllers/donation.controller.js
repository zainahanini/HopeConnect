
const Donation = require('../models/donation.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user.model');
const sendEmail = require('../services/sendEmail');

exports.createDonation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, donation_type, category, payment_method_id } = req.body;

    // Validate donation_type and category
    const validTypes = ['money', 'clothes', 'food', 'education_materials'];
    const validCategories = ['general_fund', 'education_support', 'medical_aid', 'emergency_support'];

    if (!validTypes.includes(donation_type) || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid donation type or category' });
    }

    // If money donation, process Stripe payment
    if (donation_type === 'money') {
      if (!payment_method_id) {
        return res.status(400).json({ message: "Payment method ID is required for money donations" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to cents
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

    // Create donation record
    const donation = await Donation.create({
      user_id: userId,
      amount,
      donation_type,
      category,
    });

    // Fetch user email
    const user = await User.findByPk(userId);

    if (user?.email) {
      const htmlContent = `
        <h2>Thank you for your donation!</h2>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Type:</strong> ${donation_type}</p>
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


// Get user donations
exports.getUserDonations = async (req, res) => {
  try {
    const { userId } = req.params;
    const donations = await Donation.findAll({ where: { user_id: userId } });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch donations', error: err.message });
  }
};

// Update impact message (admin only in real use)
exports.updateImpactMessage = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { impact_message } = req.body;

    const donation = await Donation.findByPk(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.impact_message = impact_message;
    await donation.save();

    res.json({ message: 'Impact message updated', donation });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update donation', error: err.message });
  }
};
