const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteerApplication.controller');

router.post('/', controller.createApplication);
router.get('/', controller.listApplications);

module.exports = router;

