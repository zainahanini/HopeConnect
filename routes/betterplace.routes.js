
const express = require('express');
const router = express.Router();
const controller = require('../controllers/betterplace.controller');

router.get('/projects', controller.getProjectsForGaza);

module.exports = router;
