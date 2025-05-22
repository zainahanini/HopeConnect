const Sponsorship = require('../models/sponsorship.model');
const User = require('../models/user.model');
const Orphan = require('../models/orphan.model');
const sendEmail = require('../services/sendEmail');

exports.requestSponsorship = async (req, res) => {
  try {
    const { orphan_id, start_date } = req.body;
    const sponsor_id = req.user.id;

    const sponsorship = await Sponsorship.create({
      sponsor_id,
      orphan_id,
      start_date,
      status: 'pending'
    });

    res.status(201).json({ message: 'Sponsorship request submitted', sponsorship });
  } catch (err) {
    console.error("Error creating sponsorship request:", err);
    res.status(500).json({ error: 'Failed to request sponsorship' });
  }
};

exports.getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll({
      include: [
        { model: User, attributes: ['id', 'full_name', 'email'] },
        { model: Orphan, attributes: ['id', 'full_name'] }
      ]
    });
    res.status(200).json(sponsorships);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to get sponsorships' });
  }
};

exports.updateSponsorship = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, start_date } = req.body;

    const sponsorship = await Sponsorship.findByPk(id);
    if (!sponsorship) return res.status(404).json({ error: 'Sponsorship not found' });

    const wasPending = sponsorship.status === 'pending';

    if (status) sponsorship.status = status;
    if (start_date) sponsorship.start_date = start_date;

    await sponsorship.save();

    if (wasPending && status === 'active') {
      const sponsor = await User.findByPk(sponsorship.sponsor_id);
      const orphan = await Orphan.findByPk(sponsorship.orphan_id);

      if (sponsor?.email) {
        await sendEmail(
          sponsor.email,
          '🎉 Sponsorship Approved!',
          `<p>Dear ${sponsor.full_name || 'Sponsor'},</p>
           <p>Your sponsorship for orphan <strong>${orphan?.full_name || 'an orphan'}</strong> has been <strong>approved</strong>.</p>
           <p>It will begin on <strong>${sponsorship.start_date}</strong>. Thank you for making a difference! </p>`
        );
      }
    }

    res.json({ message: 'Sponsorship updated', sponsorship });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: 'Update failed' });
  }
};

exports.deleteSponsorship = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Sponsorship.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Sponsorship not found' });

    res.json({ message: 'Sponsorship deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: 'Delete failed' });
  }
};
