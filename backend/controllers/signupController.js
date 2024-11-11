// controllers/signupController.js

const pool = require('../config/postgres_db'); // Import PostgreSQL pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

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

        res.status(201).json({ success: true, message: 'User signed up successfully!', token, bank_account });

    } catch (err) {
        if (err.code === '23505') { // Handle unique constraint violation (e.g., unique username or email)
            return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        console.error('Database error during signup:', err);
        return res.status(500).json({ error: 'Database error.' });
    }
};

module.exports = { signup };
