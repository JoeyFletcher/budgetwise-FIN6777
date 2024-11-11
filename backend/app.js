// app.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const signupRoutes = require('./routes/signupRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes'); // Updated import for transaction routes
const pool = require('./config/postgres_db');
const transactionWebhookRoutesWithdrawals = require('./routes/transactionWebhookRoutesWithdrawals');
const transactionWebhookRoutesDeposits = require('./routes/transactionWebhookRoutesDeposits');
const budgetRoutes = require('./routes/budgetRoutes');
const totalSpendByTypeRoutes = require('./routes/totalSpendByTypeRoutes');

const authenticate = require('./middleware/authMiddleware'); // Import the auth middleware

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:9000', optionsSuccessStatus: 200 }));  // CORS setup for development

// Routes
app.use('/api/auth', authRoutes);    // User login
app.use('/api/signup', signupRoutes);   // Signup
app.use('/api/transactions', transactionRoutes);  // Changed to plural 'transactions'
app.use('/api/user', authenticate, userRoutes); // Protect the user routes with the middleware
app.use('/api/webhook/withdrawals', transactionWebhookRoutesWithdrawals);   // Webhook received from Mambu with withdrawal transaction data
app.use('/api/webhook/deposits', transactionWebhookRoutesDeposits);   // Webhook received from Mambu with deposit transaction data
app.use('/api/budget', budgetRoutes);    // Get budgets from database
app.use('/api/totalSpendByType', totalSpendByTypeRoutes);   // Get total spend by type from database

// Test Database Connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected:', res.rows[0].now); // Logs the current timestamp
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
