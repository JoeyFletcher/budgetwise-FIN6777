const express = require('express');
const router = express.Router();
const { handleTransactionWebhookWithdrawals } = require('../controllers/transactionWebhookControllerWithdrawals');

// Post Route for the webhook
router.post('/new-withdrawalTransaction',handleTransactionWebhookWithdrawals);

module.exports = router;