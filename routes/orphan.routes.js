const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphan.controller');

router.post('/', orphanController.createOrphan);
router.get('/', orphanController.getAllOrphans);

module.exports = router;
