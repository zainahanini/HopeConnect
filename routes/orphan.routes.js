const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphan.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authenticateToken, isAdmin, orphanController.createOrphan);
router.get('/', authenticateToken, isAdmin, orphanController.getAllOrphans);
router.put('/:id', authenticateToken, isAdmin, orphanController.updateOrphan);
router.delete('/:id', authenticateToken, isAdmin, orphanController.deleteOrphan);

module.exports = router;
