require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to Budgetwise Backend!');
});

// User Routes Placeholder
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
