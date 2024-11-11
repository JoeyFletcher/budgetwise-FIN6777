import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Adjust this if your backend is running elsewhere
});

// Fetch transactions by account ID (from your own backend)
export const getTransactions = (accountId) => {
  const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
  return api.get(`/transactions/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch transaction summary for a specific account ID
export const getTransactionSummary = (accountId, startDate, endDate) => {
  const token = localStorage.getItem('token');
  return api.get(`/transactions/summary/${accountId}`, {
    params: {
      startDate,
      endDate,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch spending by category for a specific account ID
export const getSpendingByCategory = (accountId, startDate, endDate) => {
  const token = localStorage.getItem('token');
  return api.get(`/transactions/spending-by-category/${accountId}`, {
    params: {
      startDate,
      endDate,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Generate Plaid Link Token
export const generateLinkToken = () => {
  return api.post('/plaid/link/token');
};

// Exchange Public Token for Access Token
export const exchangePublicToken = (publicToken) => {
  return api.post('/plaid/exchange/public_token', { public_token: publicToken });
};

// Retrieve Accounts from Plaid
export const getAccounts = (accessToken) => {
  return api.get('/plaid/accounts', {
    params: { access_token: accessToken },
  });
};

// Retrieve Transactions from Plaid (New)
export const getPlaidTransactions = (accessToken, startDate, endDate) => {
  return api.get('/plaid/transactions', {
    params: {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    },
  });
};

export default api;
