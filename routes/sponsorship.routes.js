const express = require('express');
const router = express.Router();
const controller = require('../controllers/sponsorship.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/request', authenticateToken, controller.requestSponsorship);

router.get('/', authenticateToken, isAdmin, controller.getAllSponsorships);

router.put('/:id', authenticateToken, isAdmin, controller.updateSponsorship);

router.delete('/:id', authenticateToken, isAdmin, controller.deleteSponsorship);

router.patch('/:id/status', authenticateToken, isAdmin, controller.changeSponsorshipStatus);

module.exports = router;
