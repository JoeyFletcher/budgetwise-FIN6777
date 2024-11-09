// routes/signupRoutes.js - user signup

const express = require('express');
const router = express.Router();
const  signupController = require('../controllers/signupController');

router.post('/', signupController.signup);   //Handles user signup

module.exports = router;