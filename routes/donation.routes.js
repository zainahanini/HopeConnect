const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');

router.post('/', donationController.createDonation);
router.get('/:userId', donationController.getUserDonations);
router.put('/:donationId/impact', donationController.updateImpactMessage);
module.exports = router;
