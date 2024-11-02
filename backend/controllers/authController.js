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
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  User.findUserByUsernameOrEmail(usernameOrEmail, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords.' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.user_id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    });
  });
};

module.exports = { signup, login };
