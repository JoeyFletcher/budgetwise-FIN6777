// controllers/signupController.js

const pool = require('../config/postgres_db'); // Import PostgreSQL pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const axios = require('axios');
const base64=require('base-64');

const tenantUrl = process.env.TENANT_URL;
const u = process.env.MAMBU_USERNAME;
const p = process.env.MAMBU_PASSWORD;


const signup = async (req, res) => {
    const { username, email, firstName, lastName, password, bank_account, routing_number } = req.body;

    // Validate if all fields are provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }
    if (!firstName) {
        return res.status(400).json({ error: 'First name is required.' });
    }
    if (!lastName) {
        return res.status(400).json({ error: 'Last name is required.' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
    }
    if (!bank_account) {
        return res.status(400).json({ error: 'Bank account is required.' });
    }
    if (!routing_number) {
        return res.status(400).json({ error: 'Routing number is required.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into PostgreSQL
        const query = `
            INSERT INTO users (username, email, first_name, last_name, password, bank_account, routing_number)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id;
        `;
        const values = [username, email, firstName, lastName, hashedPassword, bank_account, routing_number];

        const result = await pool.query(query, values);
        const userId = result.rows[0].user_id;

        // Generate JWT Token upon successful signup
        const token = jwt.sign(
            {
                userId: userId,
                username: username,
                first_name: firstName,
                bank_account: bank_account,
                routing_number: routing_number,
            },
            secretKey,
            { expiresIn: '1h' }
        );

        // Prepare the Authorization header
        const authHeader = `Basic ${base64.encode(`${u}:${p}`)}`;
        console.log("Authorization Header:", authHeader);

        // Function to fetch transactions with pagination
        const fetchTransactions = async (offset = 0, limit = 50) => {
            try {
                const url = `${tenantUrl}/deposits/${bank_account}/transactions?detailsLevel=Full&offset=${offset}&limit=${limit}&paginationDetails=ON`;
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.mambu.v2+json',
                    },
                });
                return response.data;
            } catch (error) {
                console.error(`Failed to fetch transactions: ${error.message}`);
                return [];
            }
        };


        // Fetch all transactions from Mambu with pagination
        let offset = 0;
        let transactions = [];
        const limit = 50;

        while (true) {
            const data = await fetchTransactions(offset, limit);
            transactions = transactions.concat(data);

            if (data.length < limit) {
                break; // No more data to fetch
            }
            offset += limit;
        }

        // Insert transactions into PostgreSQL
        for (const transaction of transactions) {
            // Skip transactions that are not 'WITHDRAWAL' or 'DEPOSIT'
            if (transaction.type !== 'WITHDRAWAL' && transaction.type !== 'DEPOSIT') {
                console.log(`Skipping transaction ID ${transaction.id} with type ${transaction.type}`);
                continue;
            }

            const cardDetails = transaction._cards_details || {};
            const transactionQuery = `
                INSERT INTO client_transactions
                (transaction_id, transaction_date, mcc_code, detail, amount, merchant_name,
                 merchant_city, merchant_state, merchant_street, merchant_zip, db_cr, account_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (transaction_id) DO NOTHING;
            `;

            const transactionValues = [
                transaction.id,                                         // transaction_id
                transaction.valueDate ? transaction.valueDate.split('T')[0] : null, // transaction_date (date part only)
                transaction.type === 'WITHDRAWAL' ? cardDetails.mcc || null : null, // mcc_code for WITHDRAWAL
                cardDetails.detailstxn || null,                        // detail (detailstxn is used for both types)
                transaction.amount,                                    // amount
                transaction.type === 'WITHDRAWAL' ? cardDetails.merchant || null : null, // merchant_name for WITHDRAWAL
                transaction.type === 'WITHDRAWAL' ? cardDetails.city_merchant || null : null, // merchant_city for WITHDRAWAL
                transaction.type === 'WITHDRAWAL' ? cardDetails.state_merchant || null : null, // merchant_state for WITHDRAWAL
                transaction.type === 'WITHDRAWAL' ? cardDetails.street_merchant || null : null, // merchant_street for WITHDRAWAL
                transaction.type === 'WITHDRAWAL' ? cardDetails.zip || null : null, // merchant_zip for WITHDRAWAL
                transaction.type,                                      // db_cr (transaction type)
                bank_account                                           // account_id (from signup data)
            ];

            await pool.query(transactionQuery, transactionValues);
        }

        res.status(201).json({ success: true, message: 'User signed up successfully!', token, bank_account });

    } catch (err) {
        if (err.code === '23505') { // Handle unique constraint violation (e.g., unique username or email)
            return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        console.error('Error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = { signup };