require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

// ✅ Debugging log
console.log("🔍 Alpaca API Base URL:", process.env.ALPACA_BASE_URL);

// ✅ Alpaca API Credentials
const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;
const ALPACA_BASE_URL = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';

// ❌ Exit if credentials are missing
if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY || !ALPACA_BASE_URL) {
  console.error("❌ Missing Alpaca API credentials in .env!");
  process.exit(1);
}

// ✅ Alpaca API Instance
const alpacaApi = axios.create({
  baseURL: `${ALPACA_BASE_URL}/v2`,
  headers: {
    'APCA-API-KEY-ID': ALPACA_API_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
  },
});

// ✅ Route: Get Alpaca Account Data
router.get('/account', async (req, res) => {
  try {
    console.log('📡 Fetching Alpaca account data...');
    const response = await alpacaApi.get('/account');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching Alpaca account:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to fetch account data' });
  }
});

router.get('/holdings', async (req, res) => {
    try {
      console.log('📡 Fetching Alpaca holdings...');
      const response = await alpacaApi.get('/positions');
  
      // Log entire response
      console.log('✅ Alpaca Response:', JSON.stringify(response.data, null, 2));
  
      // Check if response is valid
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('⚠️ Invalid response from Alpaca:', response.data);
        return res.status(500).json({ error: 'Invalid holdings data' });
      }
  
      // Format holdings data
      const holdings = response.data.map(position => ({
        symbol: position.symbol,
        qty: parseFloat(position.qty),
        market_value: parseFloat(position.market_value),
        avg_entry_price: parseFloat(position.avg_entry_price),
        current_price: parseFloat(position.current_price),
        unrealized_pl: parseFloat(position.unrealized_pl),
        unrealized_plpc: parseFloat(position.unrealized_plpc),
      }));
  
      console.log('✅ Processed Holdings:', holdings);
      res.json(holdings);
    } catch (error) {
      console.error('❌ Error fetching holdings:', error.response ? error.response.data : error);
      res.status(500).json({ error: 'Failed to fetch holdings' });
    }
  });
  

// ✅ Route: Get Portfolio Growth (Updated Endpoint)
router.get('/portfolio_growth', async (req, res) => {
  try {
    console.log('📡 Fetching Portfolio Growth Data...');
    const response = await alpacaApi.get('/account/portfolio/history', {
      params: { period: '1M', timeframe: '1D' },
    });

    if (!response.data || !response.data.timestamp) {
      return res.status(500).json({ error: 'Invalid portfolio growth data' });
    }

    res.json({
      dates: response.data.timestamp.map(ts => new Date(ts * 1000).toISOString().split('T')[0]),
      values: response.data.equity,
    });
  } catch (error) {
    console.error('❌ Error fetching portfolio growth:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to fetch portfolio growth' });
  }
});

// ✅ Route: Get Asset Allocation (Fixes Applied)
router.get('/asset-allocation', async (req, res) => {
  try {
    console.log('📡 Fetching asset allocation...');
    const response = await alpacaApi.get('/positions');

    if (!response.data || !Array.isArray(response.data)) {
      console.error('🚨 Invalid data received from Alpaca:', response.data);
      return res.status(500).json({ error: 'Invalid asset allocation data' });
    }

    const allocation = response.data
      .filter(position => position.market_value && position.symbol) // Filter out null values
      .reduce(
        (acc, position) => {
          acc.labels.push(position.symbol);
          acc.values.push(parseFloat(position.market_value));
          return acc;
        },
        { labels: [], values: [] }
      );

    console.log('✅ Processed Asset Allocation:', allocation);
    res.json(allocation);
  } catch (error) {
    console.error('❌ Error fetching asset allocation:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to fetch asset allocation' });
  }
});

// ✅ Route: Get Stock Performance Data
router.get('/stock-performance/:symbol', async (req, res) => {
    const { symbol } = req.params;
    
    if (!symbol) {
      console.log("❌ Missing stock symbol in request.");
      return res.status(400).json({ error: "Missing stock symbol." });
    }
  
    try {
      console.log(`📡 Fetching stock performance for ${symbol}...`);
  
      // ✅ Correct API URL for stock data
      const alpacaUrl = `/v2/stocks/${symbol}/bars?timeframe=1D&limit=30`;
      console.log(`🔍 Requesting Alpaca API: ${ALPACA_BASE_URL}${alpacaUrl}`);
  
      // ✅ Fetch historical stock bars
      const response = await alpacaApi.get(alpacaUrl);
  
      // ✅ Check if response contains expected data
      console.log("📊 Raw Alpaca API Response:", response.data);
  
      if (!response.data || !response.data.bars || response.data.bars.length === 0) {
        console.warn(`⚠️ No stock data found for ${symbol}`);
        return res.status(404).json({ error: `No stock data available for ${symbol}` });
      }
  
      console.log("✅ Processed stock data:", response.data.bars);
  
      // ✅ Structure stock performance response
      res.json({
        symbol,
        dates: response.data.bars.map(bar => new Date(bar.t * 1000).toISOString().split("T")[0]), // Convert timestamps
        prices: response.data.bars.map(bar => bar.c), // Closing prices
      });
  
    } catch (error) {
      console.error(`❌ Error fetching stock performance (${symbol}):`, error.response?.data || error);
      res.status(500).json({ error: `Failed to fetch stock performance for ${symbol}` });
    }
  });  

// ✅ Route: Get All Trade Activities
router.get('/trade-history', async (req, res) => {
    try {
      console.log('📡 Fetching Trade History...');
      const response = await alpacaApi.get('/account/activities'); // Remove 'activity_type' filter
  
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        console.warn('⚠️ No trade history found.');
        return res.json([]); // Return empty array instead of 404
      }
  
      res.json(response.data.map(trade => ({
        symbol: trade.symbol,
        qty: trade.qty,
        price: trade.price,
        side: trade.side,
        date: trade.transaction_time,
        activityType: trade.activity_type, // Include type for debugging
      })));
    } catch (error) {
      console.error('❌ Error fetching trade history:', error.response?.data || error);
      res.status(500).json({ error: 'Failed to fetch trade history' });
    }
  });
  

// ✅ Route: Place a Trade
router.post('/trade', async (req, res) => {
  const { symbol, qty, side } = req.body;
  if (!symbol || !qty || !side) {
    return res.status(400).json({ error: 'Missing required trade parameters' });
  }

  try {
    console.log(`📡 Placing ${side.toUpperCase()} order for ${qty} shares of ${symbol}...`);
    const response = await alpacaApi.post('/orders', {
      symbol,
      qty,
      side,
      type: 'market',
      time_in_force: 'gtc',
    });

    res.json(response.data);
  } catch (error) {
    console.error(`❌ Error placing trade (${symbol}):`, error.response?.data || error);
    res.status(500).json({ error: 'Trade execution failed' });
  }
});

module.exports = router;
