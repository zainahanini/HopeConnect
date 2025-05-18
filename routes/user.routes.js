const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');

router.post('/register', authenticateToken, isAdmin, UserController.registerUser); 
router.post('/login', UserController.loginUser); 

module.exports = router;
