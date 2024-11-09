// controllers/signupController.js

const pool = require('../config/postgres_db');  // Import PostgreSQL pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const signup = async (req, res) => {
    const { username, email, firstName, lastName, password, bank_account, routing_number } = req.body;

    if (!username || !email || !firstName || !lastName || !password || !bank_account || !routing_number) {
        return res.status(400).json({ error: 'All fields are required.' });
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
            { userId: userId, username: username, first_name: firstName, bank_account, routing_number },
            secretKey,
            { expiresIn: '1h' }
        );

        res.status(201).json({ success: true, message: 'User signed up successfully!', token });

    } catch (err) {
        if (err.code === '23505') {  // Handle unique constraint violation
            return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        return res.status(500).json({ error: 'Database error.' });
    }
};

module.exports = { signup };
