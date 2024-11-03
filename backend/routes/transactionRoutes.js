const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Get transactions by userId
router.get('/:userId', authMiddleware, transactionController.getTransactionsByUserId);

module.exports = router;
