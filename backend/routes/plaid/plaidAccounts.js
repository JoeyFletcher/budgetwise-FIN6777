const express = require('express');
const router = express.Router();
const plaidClient = require('../../plaidClient'); // ✅ Ensure correct import

// ✅ Fetch Linked Accounts (Accessible at `/api/plaid/accounts/list`)
router.get('/list', async (req, res) => {  // 🔥 FIXED: Ensure `/list` is used
  try {
    console.log('📡 Fetching Linked Accounts...');
    
    const { access_token } = req.query; // ✅ Extracts from query params

    if (!access_token) {
      console.error('❌ Missing access token!');
      return res.status(400).json({ error: 'Missing access token' });
    }

    // ✅ Fetch accounts from Plaid
    const response = await plaidClient.accountsGet({ access_token });

    // ✅ Format response
    const formattedAccounts = response.data.accounts.map((acc) => ({
      account_id: acc.account_id,
      name: acc.name,
      type: acc.type,
      subtype: acc.subtype,
      balances: acc.balances,
      last_updated: response.data.item?.consent_expiration_time || 'N/A',
    }));

    res.json({ accounts: formattedAccounts });
  } catch (error) {
    console.error('❌ Error retrieving accounts:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to retrieve accounts' });
  }
});

module.exports = router;
