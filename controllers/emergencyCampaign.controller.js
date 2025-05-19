const Campaign = require('../models/emergency_campaign');
const Contribution = require('../models/campaign_contribution');
const sendEmail = require('../services/sendEmail'); 

class EmergencyCampaignController {
  static async createCampaign(req, res) {
    try {
      const { title, description, start_date, end_date } = req.body;
      const campaign = await Campaign.create({ title, description, start_date, end_date });

      const donors = await require('../models/user.model').findAll({ where: { role: 'donor' } });
      donors.forEach((donor) => {
        sendEmail(
          donor.email,
          `🚨 New Emergency Campaign: ${title}`,
          `<p>${description}</p><p>Contribute by ${end_date}</p>`
        );
      });

      res.status(201).json({ message: 'Campaign created and donors notified', campaign });
    } catch (err) {
      console.error('🔥 Detailed error:', err);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  }

  static async getAllCampaigns(req, res) {
    try {
      const campaigns = await Campaign.findAll();
      res.json(campaigns);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not fetch campaigns' });
    }
  }

  static async contributeToCampaign(req, res) {
    try {
      const { campaign_id, amount } = req.body;
      const user_id = req.user.id;

      const contribution = await Contribution.create({ campaign_id, amount, user_id });

      res.status(201).json({ message: 'Thank you for your contribution!', contribution });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Contribution failed' });
    }
  }
}

module.exports = EmergencyCampaignController;
