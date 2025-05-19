const express = require('express');
const router = express.Router();
const controller = require('../controllers/volunteerRequest.controller');
const authenticate = require('../middleware/authenticateToken');
const isStaff = require('../middleware/isStaff');
const isAdmin = require('../middleware/isAdmin');

router.post('/',authenticate,isAdmin||isStaff, controller.createRequest);
router.get('/', controller.listRequests);

module.exports = router;
