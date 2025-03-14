require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV], // Ensure PLAID_ENV is set (sandbox, development, production)
  baseOptions: {
    headers: {
      'Content-Type': 'application/json',
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14', // ✅ Required for Plaid API compatibility
    },
  },
});

const plaidClient = new PlaidApi(configuration);

module.exports = plaidClient;
