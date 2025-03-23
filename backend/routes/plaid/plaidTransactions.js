const express = require('express');
const router = express.Router();
const plaidClient = require('../../plaidClient'); // ✅ Ensure correct import
const fs = require('fs');
const path = require('path');

// ✅ Define storage directory for transaction sets
const DATA_DIR = path.join(__dirname, '../../data/saved_transactions');

// ✅ Ensure `saved_transactions/` directory exists
if (!fs.existsSync(DATA_DIR)) {
    console.log('📂 Creating data/saved_transactions directory...');
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ✅ Fetch Transactions from Plaid
router.get('/list', async (req, res) => {
    try {
        console.log('📡 Fetching Transactions...');

        const { access_token, start_date, end_date } = req.query;

        if (!access_token || !start_date || !end_date) {
            console.error('❌ Missing required parameters!');
            return res.status(400).json({ error: 'Missing access_token, start_date, or end_date' });
        }

        let transactions = [];
        let total_transactions = 0;
        let offset = 0;

        // ✅ Fetch transactions in batches if needed
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

        // ✅ Format response for frontend
        const formattedTransactions = transactions.map((txn) => {
            let category = txn.personal_finance_category?.primary || "Uncategorized";
            let amount = txn.amount;
            const description = txn.name?.toLowerCase() || "";

            if (description.includes("salary") || description.includes("deposit") || description.includes("payroll")) {
                category = "INCOME";
                amount = Math.abs(txn.amount);
            } else if (description.includes("interest")) {
                category = "INCOME";
                amount = Math.abs(txn.amount);
            } else if (description.includes("mortgage") || description.includes("loan")) {
                category = "LOAN_PAYMENTS";
                amount = -Math.abs(txn.amount);
            } else if (description.includes("electricity") || description.includes("utilities") || description.includes("insurance")) {
                category = "BILLS_AND_UTILITIES";
                amount = -Math.abs(txn.amount);
            } else if (description.includes("grocery") || description.includes("food") || description.includes("restaurant") || description.includes("dining")) {
                category = "FOOD_AND_DRINK";
                amount = -Math.abs(txn.amount);
            } else if (description.includes("uber") || description.includes("gas station") || description.includes("lyft")) {
                category = "TRANSPORTATION";
                amount = -Math.abs(txn.amount);
            } else if (description.includes("netflix") || description.includes("spotify") || description.includes("entertainment")) {
                category = "ENTERTAINMENT";
                amount = -Math.abs(txn.amount);
            } else if (description.includes("amazon") || description.includes("shopping") || description.includes("retail")) {
                category = "GENERAL_MERCHANDISE";
                amount = -Math.abs(txn.amount);
            } else if (description.includes("transfer") || description.includes("savings")) {
                category = "TRANSFER_IN";
                amount = txn.amount;
            }

            console.log(`🔹 Processed Transaction: ${txn.name} → ${category} (${amount})`);

            return {
                transaction_id: txn.transaction_id,
                date: txn.date,
                merchant: txn.name || 'Unknown Merchant',
                category: category,
                amount: amount,
                payment_channel: txn.payment_channel,
                included: true, // ✅ Default to included for budgeting
            };
        });

        res.json({ transactions: formattedTransactions });
    } catch (error) {
        console.error('❌ Error retrieving transactions:', error.response?.data || error);
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
});

// ✅ Save Transactions Under a Unique Name
router.post('/save', async (req, res) => {
    try {
        const { saveName, transactions } = req.body;

        if (!saveName || !transactions || !Array.isArray(transactions)) {
            console.error('❌ Invalid transactions payload');
            return res.status(400).json({ error: 'Missing or invalid saveName/transactions format' });
        }

        const filePath = path.join(DATA_DIR, `${saveName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));

        console.log(`✅ Transactions saved under: ${saveName}`);
        res.json({ message: `Transactions saved successfully as "${saveName}".` });
    } catch (error) {
        console.error('❌ Error saving transactions:', error);
        res.status(500).json({ error: 'Failed to save transactions' });
    }
});

// ✅ List All Saved Transaction Sets
router.get('/saved-sets', async (req, res) => {
    try {
        console.log("📡 Fetching list of saved transaction sets...");
        const files = fs.readdirSync(DATA_DIR);
        const sets = files.map(file => path.basename(file, '.json')); // Remove .json from names
        res.json({ sets });
    } catch (error) {
        console.error("❌ Error fetching saved transaction sets:", error);
        res.status(500).json({ error: "Failed to retrieve saved transaction sets." });
    }
});

// ✅ Load a Specific Transaction Set
router.get('/saved', async (req, res) => {
    try {
        const { setName } = req.query;

        if (!setName) {
            return res.status(400).json({ error: "Missing setName parameter." });
        }

        console.log(`📡 Loading saved transactions for: ${setName}`);
        const filePath = path.join(DATA_DIR, `${setName}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Transaction set not found." });
        }

        const transactions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json({ transactions });
    } catch (error) {
        console.error("❌ Error retrieving saved transactions:", error);
        res.status(500).json({ error: "Failed to retrieve saved transactions." });
    }
});

module.exports = router;
