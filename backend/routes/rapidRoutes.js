// backend/routes/rapidRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');
router.use(cors());

// GET /api/rapid/stock-quote
router.get('/stock-quote', async (req, res) => {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: 'Please provide a valid stock ticker symbol.' });
  }

  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'API key is missing on the server.' });
  }

  try {
    const response = await axios.get(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote?ticker=${ticker}&type=STOCKS`,
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch stock data.'
    });
  }
});

module.exports = router;