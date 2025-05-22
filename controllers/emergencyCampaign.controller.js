const Campaign = require('../models/emergency_campaign');
const Contribution = require('../models/campaign_contribution');
console.log(Contribution);
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
      console.error('Detailed error:', err);
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

  static async updateCampaign(req, res) {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date } = req.body;

    const campaign = await Campaign.findByPk(id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    campaign.title = title ?? campaign.title;
    campaign.description = description ?? campaign.description;
    campaign.start_date = start_date ?? campaign.start_date;
    campaign.end_date = end_date ?? campaign.end_date;

    await campaign.save();
    res.json({ message: 'Campaign updated', campaign });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
}


  static async contributeToCampaign(req, res) {
  try {
    const { campaign_id, type = 'money', amount, description } = req.body;
    const user_id = req.user.id;

    if (!['money', 'food', 'clothes', 'services'].includes(type)) {
      return res.status(400).json({ error: 'Invalid contribution type' });
    }

    if (type === 'money' && (!amount || isNaN(amount))) {
      return res.status(400).json({ error: 'Amount is required for money contributions' });
    }

    const contribution = await Contribution.create({
      campaign_id,
      user_id,
      type,
      amount: type === 'money' ? amount : null,
      description,
    });

    res.status(201).json({ message: 'Thank you for your contribution!', contribution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Contribution failed' });
  }
}

static async getAllContributions(req, res) {
  try {
    const contributions = await Contribution.findAll({ order: [['contributed_at', 'DESC']] });
    res.json(contributions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
}

}

module.exports = EmergencyCampaignController;
