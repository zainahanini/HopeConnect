const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');


router.post('/', authenticateToken, messageController.createMessage);

router.put('/:id/status', authenticateToken, isAdmin, messageController.updateMessageStatus);


router.get('/', authenticateToken, isAdmin, messageController.getAllMessages);
router.get('/orphan/:orphanId', messageController.getMessagesForOrphan);


module.exports = router;
