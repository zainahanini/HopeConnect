const express = require('express');
const router = express.Router();
const controller = require('../controllers/sponsorship.controller');

router.post('/', controller.createSponsorship);
router.get('/', controller.getAllSponsorships);

module.exports = router; 
