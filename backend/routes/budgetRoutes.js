const express = require('express');
const router = express.Router();
const { getBudgets } = require('../controllers/budgetController');

router.get('/:userId/:year/:month', getBudgets);

module.exports = router;