const express = require('express');
const router = express.Router();
const controller = require('../controllers/sponsorship.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authenticateToken, isAdmin, controller.createSponsorship);
router.get('/', authenticateToken, isAdmin, controller.getAllSponsorships);

module.exports = router;
