// app.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authenticate = require('./middleware/authMiddleware'); // Import the auth middleware
const transactionRoutes = require('./routes/transactionRoutes');
const plaidRoutes = require('./routes/plaidRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:9000', optionsSuccessStatus: 200 }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticate, userRoutes); // Protect the user routes with the middleware
app.use('/api/transactions', transactionRoutes);
app.use('/api/plaid', plaidRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
