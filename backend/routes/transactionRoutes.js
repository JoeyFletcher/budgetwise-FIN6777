const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTransactions, getTransactionSummary, getSpendingByCategory } = require('../controllers/transactionController');

// Get transactions by bank account
router.get('/:bankAccount', authMiddleware, getTransactions);

// Get transaction summary by bank account
router.get('/summary/:bankAccount', authMiddleware, getTransactionSummary);

// Get spending by category for a specific bank account
router.get('/spending-by-category/:bankAccount', authMiddleware, getSpendingByCategory);

module.exports = router;
