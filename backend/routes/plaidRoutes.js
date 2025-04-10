const express = require('express');
const router = express.Router();
const plaidClient = require('../plaidClient'); // ✅ Ensure correct path

// ✅ Import Individual Plaid Route Handlers
router.use('/auth', require('./plaid/plaidAuth'));
router.use('/accounts', require('./plaid/plaidAccounts'));
router.use('/transactions', require('./plaid/plaidTransactions'));
router.use('/webhooks', require('./plaid/plaidWebhooks'));

// ✅ Generate Plaid Link Token (Fixed Route Prefix)
router.post('/link/token', async (req, res) => { // 🔥 FIXED: Removed extra `/plaid`
  try {
    console.log('📡 Generating Plaid Link Token...');
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: req.body.userId || 'default_user_id' },
      client_name: 'Budgetwise App',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('❌ Error generating link token:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to generate Plaid link token' });
  }
});

// ✅ Exchange Public Token for Access Token (Fixed Route Prefix)
router.post('/exchange/public_token', async (req, res) => { // 🔥 FIXED: Removed extra `/plaid`
  try {
    console.log('📡 Exchanging Public Token for Access Token...');
    const { public_token } = req.body;
    if (!public_token) {
      console.error('❌ public_token is undefined or missing!');
      return res.status(400).json({ error: 'Missing public token' });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    res.json({ access_token: response.data.access_token, item_id: response.data.item_id });
  } catch (error) {
    console.error('❌ Error exchanging public token:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to exchange public token' });
  }
});

module.exports = router;
