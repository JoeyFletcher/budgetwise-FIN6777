// authController.js (Updated for SQLite)

const db = require('../config/sqlite_db'); // Import SQLite connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const login = async (req, res) => {
  console.log('🔹 Login request received:', req.body);
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    console.log('⚠️ Missing fields: usernameOrEmail or password');
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  try {
    // Find user by username or email
    const query = `
      SELECT user_id, username, first_name, password
      FROM users
      WHERE username = ? OR email = ?;
    `;
    const values = [usernameOrEmail, usernameOrEmail];

    db.get(query, values, async (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: 'Database error.' });
      }

      if (!user) {
        console.log('⚠️ User not found:', usernameOrEmail);
        return res.status(404).json({ error: 'User not found.' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Password mismatch for:', usernameOrEmail);
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      console.log('✅ User authenticated successfully');
      // Generate JWT Token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username, first_name: user.first_name },
        secretKey,
        { expiresIn: '1h' }
      );

      console.log('📡 Sending login response:', { success: true, token });
      res.status(200).json({ success: true, message: 'Login successful', token });
    });
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { login };
