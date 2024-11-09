const express = require('express');
const router = express.Router();
const { handleTransactionWebhookDeposits } = require('../controllers/transactionWebhookControllerDeposits');

// Post Route for the webhook
router.post('/new-depositTransaction',handleTransactionWebhookDeposits);

module.exports = router;