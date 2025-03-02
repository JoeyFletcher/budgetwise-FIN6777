// signupController.js (Updated for SQLite)

const db = require('../config/sqlite_db'); // Import SQLite database connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const signup = async (req, res) => {
    const { username, email, firstName, lastName, password } = req.body;

    // Validate required fields
    if (!username) return res.status(400).json({ error: 'Username is required.' });
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    if (!firstName) return res.status(400).json({ error: 'First name is required.' });
    if (!lastName) return res.status(400).json({ error: 'Last name is required.' });
    if (!password) return res.status(400).json({ error: 'Password is required.' });

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into SQLite
        const query = `
            INSERT INTO users (username, email, first_name, last_name, password)
            VALUES (?, ?, ?, ?, ?);
        `;
        const values = [username, email, firstName, lastName, hashedPassword];

        db.run(query, values, function (err) {
            if (err) {
                console.error('❌ Database error:', err);
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or Email already exists.' });
                }
                return res.status(500).json({ error: 'Database error.' });
            }

            const userId = this.lastID; // Get the newly inserted user's ID

            // Generate JWT Token upon successful signup
            const token = jwt.sign(
                {
                    userId: userId,
                    username: username,
                    first_name: firstName
                },
                secretKey,
                { expiresIn: '1h' }
            );

            console.log('✅ User signed up successfully:', username);
            res.status(201).json({ success: true, message: 'User signed up successfully!', token });
        });
    } catch (err) {
        console.error('❌ Unexpected error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = { signup };
