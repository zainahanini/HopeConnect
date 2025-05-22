const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticateToken');
const isAdmin=require('../middleware/isAdmin');
const deliveryController = require('../controllers/deliveryAgent.controller');
router.post('/add-driver', authMiddleware, isAdmin, deliveryController.createDriver);

router.post('/:agentId/update-location',authMiddleware, deliveryController.updateAgentLocation);


module.exports = router;

