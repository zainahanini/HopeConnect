const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteerRequest.controller');

router.post('/', controller.createRequest);
router.get('/', controller.listRequests);

module.exports = router;
