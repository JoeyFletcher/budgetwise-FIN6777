// authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const signup = (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;

  if (!username || !email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password.' });
    }

    User.createUser(username, email, firstName, lastName, hashedPassword, (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        return res.status(500).json({ error: 'Database error.' });
      }
      res.status(201).json({ message: 'User signed up successfully!' });
    });
  });
};

const login = (req, res) => {
  console.log('Login request received with:', req.body);
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    console.log('Missing fields: usernameOrEmail or password');
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  User.findUserByUsernameOrEmail(usernameOrEmail, (err, user) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (!user) {
      console.log('User not found with:', usernameOrEmail);
      return res.status(404).json({ error: 'User not found.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Error comparing passwords.' });
      }

      if (!isMatch) {
        console.log('Password mismatch for user:', usernameOrEmail);
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      console.log('User authenticated successfully');
      // Generate JWT Token
      const token = jwt.sign({ userId: user.user_id, username: user.username }, secretKey, { expiresIn: '1h' });

      console.log('Sending response:', {
        success: true,
        message: 'Login successful',
        token
      });

      res.status(200).json({ success: true, message: 'Login successful', token });
    });
  });
};

module.exports = { signup, login };
