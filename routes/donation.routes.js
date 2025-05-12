const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');

router.post('/', donationController.createDonation);
router.get('/user', donationController.getUserDonations);

module.exports = router;
