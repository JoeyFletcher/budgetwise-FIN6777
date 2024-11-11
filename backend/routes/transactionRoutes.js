const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTransactions, getTransactionSummary, getSpendingByCategory } = require('../controllers/transactionController');

// Get transactions by account ID
router.get('/:accountId', authMiddleware, getTransactions);

// Get transaction summary by account ID
router.get('/summary/:accountId', authMiddleware, getTransactionSummary);

// Get spending by category for a specific account ID
router.get('/spending-by-category/:accountId', authMiddleware, getSpendingByCategory);

module.exports = router;
