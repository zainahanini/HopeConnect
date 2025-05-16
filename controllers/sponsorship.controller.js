const Sponsorship = require('../models/sponsorship.model');

exports.createSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.create(req.body);
    res.status(201).json(sponsorship);
  } catch (err) {
    console.error("error while creating spnosership:", err);
    res.status(500).json({ error: 'failed to create sponsorship, try again' });
  }
};

exports.getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll();
    res.status(200).json(sponsorships);
  } catch (err) {
    res.status(500).json({ error: 'failed to get sponsorships' });
  }
};
