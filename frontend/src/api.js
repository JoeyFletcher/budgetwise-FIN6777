import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Adjust if your backend runs elsewhere
});

// Get auth token from local storage
const getAuthToken = () => localStorage.getItem('token');

// Transactions API (Bank Transactions)
export const getTransactions = (bankAccount) => {
  return api.get(`/transactions/${bankAccount}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const getTransactionSummary = (bankAccount, startDate, endDate) => {
  return api.get(`/transactions/summary/${bankAccount}`, {
    params: { startDate, endDate },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const getSpendingByCategory = (bankAccount, startDate, endDate) => {
  return api.get(`/transactions/spending-by-category/${bankAccount}`, {
    params: { startDate, endDate },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

// Plaid API (Bank Integration)
export const generateLinkToken = () => {
  return api.post('/plaid/link/token', {}, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const exchangePublicToken = (publicToken) => {
  return api.post('/plaid/exchange/public_token', { public_token: publicToken }, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const getAccounts = (accessToken) => {
  return api.get('/plaid/accounts', {
    params: { access_token: accessToken },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const getPlaidTransactions = (accessToken, startDate, endDate) => {
  return api.get('/plaid/transactions', {
    params: { access_token: accessToken, start_date: startDate, end_date: endDate },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

// Alpaca API (Paper Trading & Investments)
export const getAlpacaAccount = () => {
  return api.get('/alpaca/account', {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const getAlpacaPositions = () => {
  return api.get('/alpaca/positions', {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

export const placeAlpacaTrade = (symbol, qty, side) => {
  return api.post('/alpaca/trade', { symbol, qty, side }, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

// User Authentication
export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const signupUser = (userData) => {
  return api.post('/signup', userData);
};

export const getUserDashboard = () => {
  return api.get('/user/dashboard', {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};

// Export default API instance
export default api;
