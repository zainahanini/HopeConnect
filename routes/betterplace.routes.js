const express = require('express');
const router = express.Router();
const controller = require('../controllers/betterplace.controller');
const Authenticate = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');
router.get('/sync-projects',Authenticate,isAdmin,controller.syncProjectsFromBetterplace);
router.get('/available_projects',Authenticate,controller.getAvailableProjectsFromDb);

module.exports = router;
