// plaidRoutes.js

const express = require('express');
const router = express.Router();
const plaidClient = require('../plaidClient'); // Import the Plaid client

// Generate Link Token
router.post('/link/token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: req.body.userId ? req.body.userId.toString() : 'default_user_id',
      },
      client_name: 'Your App Name',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error generating link token:', error);
    res.status(500).json({ error: 'Unable to generate link token' });
  }
});

// Exchange Public Token for Access Token
router.post('/exchange/public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    res.json(response.data);
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).send('Failed to exchange public token');
  }
});

// Retrieve Account Balances
router.get('/accounts', async (req, res) => {
  try {
    const { access_token } = req.query;
    const response = await plaidClient.accountsBalanceGet({ access_token });
    res.json(response.data);
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    res.status(500).send('Failed to retrieve accounts');
  }
});

// Retrieve Transactions (New)
router.get('/transactions', async (req, res) => {
  try {
    const { access_token, start_date, end_date } = req.query;

    // Plaid requires start and end dates for transactions retrieval
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: start_date || '2023-01-01', // Replace with dynamic dates as needed
      end_date: end_date || new Date().toISOString().split('T')[0],
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).send('Failed to retrieve transactions');
  }
});

module.exports = router;
