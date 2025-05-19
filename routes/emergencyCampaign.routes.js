const express = require('express');
const router = express.Router();
const controller = require('../controllers/emergencyCampaign.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authenticateToken, isAdmin, controller.createCampaign);
router.get('/', controller.getAllCampaigns);
router.post('/contribute', authenticateToken, controller.contributeToCampaign);

module.exports = router;
