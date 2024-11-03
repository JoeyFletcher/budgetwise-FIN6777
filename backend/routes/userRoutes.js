const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

// Route to get user-specific dashboard data
router.get('/dashboard', authenticate, userController.getUserDashboard);

module.exports = router;
