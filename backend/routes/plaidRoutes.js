const express = require('express');
const router = express.Router();
const plaidClient = require('../plaidClient');
require('dotenv').config();

let ACCESS_TOKEN = process.env.PLAID_ACCESS_TOKEN || null;

// ✅ Generate Plaid Link Token
router.post('/link/token', async (req, res) => {
  try {
    console.log('📡 Generating Plaid Link Token...');

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: req.body.userId ? req.body.userId.toString() : 'default_user_id',
      },
      client_name: 'Budgetwise App',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    console.log('✅ Link Token Generated:', response.data.link_token);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('❌ Error generating link token:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to generate Plaid link token' });
  }
});

// ✅ Exchange Public Token for Access Token
router.post('/exchange/public_token', async (req, res) => {
  try {
    console.log('📡 Exchanging Public Token for Access Token...');
    const { public_token } = req.body;

    if (!public_token) {
      return res.status(400).json({ error: 'Missing public token' });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token });

    ACCESS_TOKEN = response.data.access_token;

    console.log('✅ Access Token Received:', ACCESS_TOKEN);

    res.json({
      access_token: ACCESS_TOKEN,
      item_id: response.data.item_id,
    });
  } catch (error) {
    console.error('❌ Error exchanging public token:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to exchange public token' });
  }
});

// ✅ Retrieve Linked Accounts (💡 Fixes 404 Issue)
router.get('/accounts', async (req, res) => {
  try {
    console.log('📡 Fetching Linked Accounts...');
    const access_token = req.query.access_token || ACCESS_TOKEN;

    if (!access_token) {
      return res.status(400).json({ error: 'Missing access token' });
    }

    const response = await plaidClient.accountsGet({ access_token });

    console.log(`✅ Retrieved ${response.data.accounts.length} accounts.`);
    res.json(response.data.accounts);
  } catch (error) {
    console.error('❌ Error retrieving accounts:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to retrieve accounts' });
  }
});

// ✅ Retrieve Transactions (Fixing Credit/Debit Sign Issues)
router.get('/transactions', async (req, res) => {
  try {
    console.log('📡 Fetching Transactions...');
    const access_token = req.query.access_token || ACCESS_TOKEN;

    if (!access_token) {
      return res.status(400).json({ error: 'Missing access token' });
    }

    const start_date = req.query.start_date || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end_date = req.query.end_date || new Date().toISOString().split('T')[0];

    let transactions = [];
    let total_transactions = 0;
    let offset = 0;

    do {
      const response = await plaidClient.transactionsGet({
        access_token,
        start_date,
        end_date,
        options: { count: 100, offset },
      });

      total_transactions = response.data.total_transactions;
      transactions = [...transactions, ...response.data.transactions];
      offset += response.data.transactions.length;

    } while (transactions.length < total_transactions);

    // ✅ Remove Duplicates
    const uniqueTransactions = new Map();
    
    transactions.forEach(txn => {
      if (!uniqueTransactions.has(txn.transaction_id)) {
        uniqueTransactions.set(txn.transaction_id, txn);
      }
    });

    const cleanedTransactions = Array.from(uniqueTransactions.values());

    // ✅ Process Transactions (Fixing Signs Using `transaction_type`)
    const formattedTransactions = cleanedTransactions.map((txn) => {
      const merchant = txn.name || txn.merchant_name || 'Unknown Merchant';
      const category = txn.personal_finance_category?.primary || (txn.category ? txn.category.join(' > ') : 'Uncategorized');

      let correctedAmount = txn.amount;

      // 🔹 **Correcting Amount Sign Based on Transaction Type**
      if (txn.transaction_type === 'credit' || category === 'INCOME') {
        correctedAmount = Math.abs(txn.amount); // **Ensure credits are positive**
      } else {
        correctedAmount = -Math.abs(txn.amount); // **Ensure expenses are negative**
      }

      return {
        transaction_id: txn.transaction_id,
        date: txn.date,
        merchant,
        category,
        amount: correctedAmount,
        include: true,
      };
    });

    console.log(`✅ Retrieved ${formattedTransactions.length} unique transactions.`);
    res.json(formattedTransactions);
  } catch (error) {
    console.error('❌ Error retrieving transactions:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

module.exports = router;
