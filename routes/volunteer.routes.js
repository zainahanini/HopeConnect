const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteer.controller');
const authenticate = require('../middleware/authenticateToken');

router.post('/', authenticate, controller.createVolunteer);

module.exports = router;

