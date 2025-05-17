const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matching.controller');

router.get('/matches/:requestId', matchingController.getMatchesForRequest);

module.exports = router;
