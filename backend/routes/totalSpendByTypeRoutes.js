const express = require('express');
const router = express.Router();
const { getTotalSpendByType } = require('../controllers/totalSpendByTypeController');

router.get('/:userId/:year/:month', getTotalSpendByType);

module.exports = router;