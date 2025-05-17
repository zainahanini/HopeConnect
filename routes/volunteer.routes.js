const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteer.controller');

router.post('/', controller.createVolunteer);

module.exports = router;
