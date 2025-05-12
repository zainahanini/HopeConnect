const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');

router.post('/', volunteerController.registerVolunteer);
router.get('/', volunteerController.getAllVolunteers);

module.exports = router;
