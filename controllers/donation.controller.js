const Donation = require('../../../Desktop/4th year 2nd semester/advanced/hopeconnect-nodejs-pg/models/donation.model');

exports.createDonation = async (req, res) => {
  const donation = await Donation.create(req.body);
  res.status(201).json(donation);
};

exports.getUserDonations = async (req, res) => {
  const donations = await Donation.findAll({ where: { donorId: req.body.donorId }, include: ['orphan'] });
  res.json(donations);
};
