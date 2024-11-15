import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Adjust this if your backend is running elsewhere
});

// Fetch transactions by account ID (from your own backend)
export const getTransactions = (bankAccount) => { // Updated to use bankAccount instead of accountId
  const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
  return api.get(`/transactions/${bankAccount}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch transaction summary for a specific account ID
export const getTransactionSummary = (bankAccount, startDate, endDate) => { // Updated to use bankAccount instead of accountId
  const token = localStorage.getItem('token');
  return api.get(`/transactions/summary/${bankAccount}`, {
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
export const getSpendingByCategory = (bankAccount, startDate, endDate) => { // Updated to use bankAccount instead of accountId
  const token = localStorage.getItem('token');
  return api.get(`/transactions/spending-by-category/${bankAccount}`, {
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
  const token = localStorage.getItem('token'); // Added token for authenticated requests
  return api.post('/plaid/link/token', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Exchange Public Token for Access Token
export const exchangePublicToken = (publicToken) => {
  const token = localStorage.getItem('token'); // Added token for authenticated requests
  return api.post('/plaid/exchange/public_token', { public_token: publicToken }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Retrieve Accounts from Plaid
export const getAccounts = (accessToken) => {
  const token = localStorage.getItem('token'); // Added token for authenticated requests
  return api.get('/plaid/accounts', {
    params: { access_token: accessToken },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Retrieve Transactions from Plaid (New)
export const getPlaidTransactions = (accessToken, startDate, endDate) => {
  const token = localStorage.getItem('token'); // Added token for authenticated requests
  return api.get('/plaid/transactions', {
    params: {
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
