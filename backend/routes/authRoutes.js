// authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post ("/twofactauthcheck",authController.twoFactorAuth)
module.exports = router;
