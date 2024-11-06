<template>
  <section class="link-bank-section">
    <div class="link-bank-container">
      <h2>Link Your Bank Account</h2>
      <button @click="generateLinkToken" class="link-bank-button">Connect Your Bank Account</button>
      <div v-if="accounts.length > 0" class="linked-accounts">
        <h3>Linked Accounts</h3>
        <ul>
          <li v-for="account in accounts" :key="account.account_id">
            <strong>{{ account.name }}</strong> - {{ account.subtype }} - Balance: {{ account.balances.current }} USD
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../../../api';

export default {
  name: 'LinkBankSection',
  setup() {
    const linkToken = ref(null);
    const accounts = ref([]);

    const generateLinkToken = async () => {
      try {
        const response = await api.post('/plaid/link/token');
        linkToken.value = response.data.link_token;
        initializePlaidLink(linkToken.value);
      } catch (error) {
        console.error('Error generating link token:', error);
      }
    };

    const initializePlaidLink = (linkToken) => {
      if (window.Plaid) {
        const handler = window.Plaid.create({
          token: linkToken,
          onSuccess: (public_token, metadata) => {
            exchangePublicToken(public_token);
          },
          onExit: (err, metadata) => {
            if (err) {
              console.error('Error with Plaid Link:', err);
            }
          },
        });
        handler.open();
      } else {
        console.error('Plaid library not loaded. Make sure the Plaid script is included.');
      }
    };

    const exchangePublicToken = async (publicToken) => {
      try {
        const response = await api.post('/plaid/exchange/public_token', { public_token: publicToken });
        localStorage.setItem('access_token', response.data.access_token);
        console.log('Successfully exchanged public token and saved access token.');
        fetchLinkedAccounts(response.data.access_token);
      } catch (error) {
        console.error('Error exchanging public token:', error);
      }
    };

    const fetchLinkedAccounts = async (accessToken) => {
      try {
        const response = await api.get('/plaid/accounts', {
          params: { access_token: accessToken },
        });
        accounts.value = response.data.accounts;
      } catch (error) {
        console.error('Error fetching linked accounts:', error);
      }
    };

    onMounted(() => {
      const plaidScript = document.createElement('script');
      plaidScript.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      plaidScript.async = true;
      document.head.appendChild(plaidScript);
    });

    return {
      generateLinkToken,
      accounts,
    };
  },
};
</script>

<style scoped>
.link-bank-section {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  font-family: 'Arial, sans-serif';
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.link-bank-container {
  text-align: center;
}

.link-bank-button {
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.link-bank-button:hover {
  background-color: #0056b3;
}

.linked-accounts {
  margin-top: 20px;
  text-align: left;
}

.linked-accounts h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.linked-accounts ul {
  list-style: none;
  padding: 0;
}

.linked-accounts li {
  font-size: 1.1rem;
  margin: 10px 0;
  color: #333;
}
</style>
