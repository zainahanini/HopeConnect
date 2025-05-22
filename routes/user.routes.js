const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');


router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

router.post('/create-admin', authenticateToken, isAdmin, UserController.createAdmin);
router.put('/:id', authenticateToken, isAdmin, UserController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, UserController.deleteUser);

module.exports = router;
