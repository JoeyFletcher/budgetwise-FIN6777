const express = require('express');
const router = express.Router();
const plaidClient = require('../../plaidClient'); // ✅ Ensure correct import

// 🚀 Handle Plaid Webhooks
router.post('/webhook', async (req, res) => {
  try {
    console.log('📡 Received Webhook:', JSON.stringify(req.body, null, 2));

    const { webhook_code, item_id, error } = req.body;

    if (error) {
      console.error('❌ Plaid Webhook Error:', error);
      return res.sendStatus(500);
    }

    switch (webhook_code) {
      case 'TRANSACTIONS_UPDATED':
        console.log('🔄 Transactions updated! Refreshing...');
        await refreshTransactions(item_id);
        break;
      case 'INCOME_UPDATED':
        console.log('💰 Income data updated! Fetching payroll deposits...');
        await refreshIncome(item_id);
        break;
      case 'ITEM_LOGIN_REPAIRED':
        console.log('🔑 Login repaired! Ensuring access remains valid...');
        await verifyAccess(item_id);
        break;
      case 'ERROR':
        console.error('⚠️ Plaid reported an error:', req.body.error);
        break;
      default:
        console.log('ℹ️ Unhandled Webhook:', webhook_code);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.sendStatus(500);
  }
});

// 🚀 Refresh Transactions for Given Item ID
async function refreshTransactions(item_id) {
  try {
    console.log(`📡 Refreshing transactions for item_id: ${item_id}`);

    // Here, fetch access token from your DB (not stored globally)
    const access_token = await getAccessTokenForItem(item_id);
    if (!access_token) {
      console.error('❌ No access token found for item_id:', item_id);
      return;
    }

    const response = await plaidClient.transactionsSync({ access_token });
    console.log('✅ Transactions refreshed:', response.data);

    // 🔥 Store transactions in your database (to be implemented)
  } catch (error) {
    console.error('❌ Error refreshing transactions:', error.response?.data || error);
  }
}

// 🚀 Refresh Payroll Deposits for Given Item ID
async function refreshIncome(item_id) {
  try {
    console.log(`📡 Refreshing income data for item_id: ${item_id}`);

    const access_token = await getAccessTokenForItem(item_id);
    if (!access_token) {
      console.error('❌ No access token found for item_id:', item_id);
      return;
    }

    const response = await plaidClient.incomeGet({ access_token });
    console.log('✅ Income data refreshed:', response.data);

    // 🔥 Store income data in your database (to be implemented)
  } catch (error) {
    console.error('❌ Error refreshing income:', error.response?.data || error);
  }
}

// 🚀 Verify Access for Given Item ID
async function verifyAccess(item_id) {
  try {
    console.log(`🔑 Verifying access for item_id: ${item_id}`);

    const access_token = await getAccessTokenForItem(item_id);
    if (!access_token) {
      console.error('❌ No access token found for item_id:', item_id);
      return;
    }

    const response = await plaidClient.itemGet({ access_token });
    console.log('✅ Access verified:', response.data);
  } catch (error) {
    console.error('❌ Error verifying access:', error.response?.data || error);
  }
}

// 🚀 Simulated Function to Fetch Access Token from DB
async function getAccessTokenForItem(item_id) {
  // 🔥 Replace this with actual DB lookup
  console.log(`🔍 Looking up access token for item_id: ${item_id}`);
  return process.env.PLAID_ACCESS_TOKEN || null; // Placeholder (replace with DB call)
}

module.exports = router;
