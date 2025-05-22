const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteerApplication.controller');
const authenticate = require('../middleware/authenticateToken');
const isStaff = require('../middleware/isStaff');
const isAdmin = require('../middleware/isAdmin');
router.post('/',authenticate, controller.createApplication);
router.get('/', authenticate, isAdmin||isStaff,controller.listApplications);
router.put('/:applicationId/status',authenticate, isAdmin, controller.updateApplicationStatus);
module.exports = router;

