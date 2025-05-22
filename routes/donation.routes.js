const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller');
const Authenticate = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');
const isStaff = require('../middleware/isStaff');
const deliveryController = require('../controllers/deliveryAgent.controller');

router.post('/newDonation',Authenticate, donationController.createDonation);
router.get('/',Authenticate, donationController.getUserDonations);
router.get('/all',Authenticate, isAdmin, donationController.getAllDonations);
router.put('/:donationId/impact',Authenticate, isAdmin || isStaff, donationController.updateImpactMessage);

router.post('/:donationId/assign-agent', donationController.assignNearestAgent);
router.get('/:donationId/track', deliveryController.trackDonation);

module.exports = router;

