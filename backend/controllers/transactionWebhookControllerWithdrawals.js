const pool = require('../config/postgres_db');  // Importing the PostgreSQL connection

// Controller function to handle the webhook for withdrawal transactions.
// When a new withdrawal transaction is posted in the user's bank account in the core banking system,
// We receive a notification to aggregate this data into our database.
const handleTransactionWebhookWithdrawals = async (req, res) => {
    const {
        transaction_id,
        transaction_date,
        mcc_code,
        detail,
        transaction_amount,
        merchant_name,
        merchant_city,
        merchant_state,
        merchant_street,
        merchant_zip,
        db_cr,
        account_id
    } = req.body;

    // Checking if all required fields are present in the request body
    if (!transaction_id || !transaction_date || !mcc_code || !transaction_amount || !db_cr || !account_id) {
        console.error('Error: Missing required webhook data');
        return res.status(400).json({ error: 'Missing required webhook data.' });
    }

    // Print the received data to the console for debugging
    console.log("Webhook data received:", req.body);

    // Convert db_cr to uppercase
    const uppercaseDbCr = db_cr.toUpperCase();
    console.log("Converted db_cr to uppercase:", uppercaseDbCr);  // For debugging

    try {

        // Checking if account_id exists in database, as we only store data from users
        // that have registered their bank account

        const accountCheckQuery = `SELECT * FROM users WHERE bank_account=$1`;
        const accountCheckResult = await pool.query(accountCheckQuery, [account_id]);

        if (accountCheckResult.rowCount === 0){
            //Account ID not found in the database
            console.log(`Account ID ${account_id} not found. Skipping transaction.`);
            return res.status(404).json({message:'Account ID not found. Transaction not saved.'});
        }
        // Account ID exists, proceed to save the transaction
        const insertQuery = `
            INSERT INTO client_transactions
            (transaction_id, transaction_date, mcc_code, detail, amount, merchant_name,
             merchant_city, merchant_state, merchant_street, merchant_zip, db_cr, account_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;

        const values = [
            transaction_id, transaction_date, mcc_code, detail, transaction_amount, merchant_name,
            merchant_city, merchant_state, merchant_street, merchant_zip, uppercaseDbCr, account_id
        ];

        await pool.query(insertQuery, values); // Executes the database insertion
        res.status(200).json({ message: 'Transaction saved successfully.' });
        console.log('Webhook data saved successfully in the database');
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ error: 'Server error while saving transaction.' });
    }
};

module.exports = {
    handleTransactionWebhookWithdrawals
};

