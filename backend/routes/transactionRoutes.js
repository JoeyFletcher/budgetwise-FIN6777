const express = require('express');
const router = express.Router();
//const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const { getTransactions } = require('../controllers/transactionController'); // Astrid


// Get transactions by userId
//router.get('/:userId', authMiddleware, transactionController.getTransactionsByUserId);

// Route to get transactions for a specific user ID
router.get('/:userId',getTransactions);  //Astrid

module.exports = router;

