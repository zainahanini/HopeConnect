const express = require('express');
const router = express.Router();

const Sponsorship = require('../models/sponsorship.model');
const Orphan = require('../models/orphan.model');
const OrphanUpdate = require('../models/orphan_update'); 

router.get('/sponsored-orphans/:userId', async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll({
      where: { sponsor_id: req.params.userId },
      include: [{ model: Orphan }]
    });

    res.json(sponsorships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sponsored orphans' });
  }
});

router.get('/updates/:userId', async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll({
      where: { sponsor_id: req.params.userId }
    });

    const orphanIds = sponsorships.map(s => s.orphan_id);

    const updates = await OrphanUpdate.findAll({
      where: { orphan_id: orphanIds }
    });

    res.json(updates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

module.exports = router;
