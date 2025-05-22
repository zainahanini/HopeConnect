const Partner = require('../models/partner');

class PartnerController {
  static async createPartner(req, res) {
    try {
      const { name, type, contact_email, website, api_endpoint, description } = req.body;
      const partner = await Partner.create({ name, type, contact_email, website, api_endpoint, description });
      res.status(201).json(partner);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create partner' });
    }
  }

  static async getAllPartners(req, res) {
    try {
      const partners = await Partner.findAll();
      res.json(partners);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch partners' });
    }
  }

  static async getPartnerById(req, res) {
    try {
      const partner = await Partner.findByPk(req.params.id);
      if (!partner) return res.status(404).json({ error: 'Partner not found' });
      res.json(partner);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch partner' });
    }
  }

  static async deletePartner(req, res) {
  try {
    const partner = await Partner.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    await partner.destroy();
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
}

  static async updatePartner(req, res) {
    try {
      const { name, type, contact_email, website, api_endpoint, description } = req.body;
      const partner = await Partner.findByPk(req.params.id);
      if (!partner) return res.status(404).json({ error: 'Partner not found' });

      await partner.update({ name, type, contact_email, website, api_endpoint, description });
      res.json(partner);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update partner' });
    }
  }
}

module.exports = PartnerController;
