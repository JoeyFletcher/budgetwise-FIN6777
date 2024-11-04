
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/transactionWebhook', transactionController.transactionWebhook);

module.exports = router;
