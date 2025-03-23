const express = require('express');
const router = express.Router();
const plaidClient = require('../../plaidClient');

let ACCESS_TOKEN = process.env.PLAID_ACCESS_TOKEN || null;

// ✅ Generate Plaid Link Token
router.post('/link/token', async (req, res) => {
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

// ✅ Exchange Public Token for Access Token
router.post('/exchange/public_token', async (req, res) => {
  try {
    console.log('📡 Received Request Body:', req.body); // Debugging

    const { public_token } = req.body;
    
    if (!public_token) {
      console.error('❌ public_token is undefined or missing!');
      return res.status(400).json({ error: 'Missing public token' });
    }

    console.log('📡 Exchanging Public Token for Access Token...');
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    ACCESS_TOKEN = response.data.access_token;

    // ✅ Register Webhook
    await plaidClient.itemWebhookUpdate({
      access_token: ACCESS_TOKEN,
      webhook: 'https://yourbackend.com/plaid/webhook',
    });

    res.json({ access_token: ACCESS_TOKEN, item_id: response.data.item_id });
  } catch (error) {
    console.error('❌ Error exchanging public token:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to exchange public token' });
  }
});

module.exports = router;
