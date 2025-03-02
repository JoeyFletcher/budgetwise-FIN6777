require('dotenv').config();
const axios = require('axios');

const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;
const BASE_URL = 'https://paper-api.alpaca.markets/v2';

const alpacaAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'APCA-API-KEY-ID': ALPACA_API_KEY,
    'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
  },
});

module.exports = alpacaAPI;
