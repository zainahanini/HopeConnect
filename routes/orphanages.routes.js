const express = require('express');
const router = express.Router();
const Orphanage = require('../models/orphanage.model');
const OrphanageReview = require('../models/orphanage_review.model');
const  isAdmin  = require('../middleware/isAdmin');

router.get('/', async (req, res) => {
  try {
    const orphanages = await Orphanage.findAll({
      where: { verified: true } 
    });
    res.json(orphanages);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const authenticate = require('../middleware/authenticateToken'); 

router.patch('/:id/verify', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const orphanage = await Orphanage.findByPk(id);
    if (!orphanage) return res.status(404).json({ error: 'Orphanage not found' });

    orphanage.verified = true;
    await orphanage.save();

    res.json({ message: 'Orphanage verified.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (role !== 'sponsor') {
      return res.status(403).json({ error: 'Only sponsors can submit reviews' });
    }

    const review = await OrphanageReview.create({
      orphanage_id: id,
      user_id: userId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await OrphanageReview.findAll({ where: { orphanage_id: id } });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;