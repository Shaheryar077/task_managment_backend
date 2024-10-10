const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Adjust path as needed
const authenticateToken = require('../middlware/authMiddleware')

// Route for user registration
router.post('/register', userController.registerUser);

// Route for user login
router.post('/login', userController.loginUser);



// Route to get user by ID
router.get('/:id', authenticateToken, userController.getUserById);

//
router.post('/logout', authenticateToken, userController.logoutUser);

router.post('/refresh-token', userController.refreshToken);

module.exports = router;