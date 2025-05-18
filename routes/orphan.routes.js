const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphan.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authenticateToken, isAdmin, orphanController.createOrphan);
router.get('/', authenticateToken, isAdmin, orphanController.getAllOrphans);

module.exports = router;
