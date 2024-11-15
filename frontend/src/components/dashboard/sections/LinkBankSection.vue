<template>
  <section class="link-bank-section">
    <div class="link-bank-container">
      <div class="header-container">
        <h2>Link Your Bank Account</h2>
        
      </div>
      <button @click="generateLinkToken" class="link-bank-button">
        Connect Your Bank Account
      </button>
      <div v-if="accounts.length > 0" class="linked-accounts">
        <h3>Linked Accounts</h3>
        <ul>
          <li v-for="account in accounts" :key="account.account_id" class="account-item">
            <div class="account-info">
              <strong>{{ account.name }}</strong> - {{ account.subtype }}
            </div>
            <div class="account-balance">
              Balance: {{ account.balances.current }} USD
            </div>
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
    const loading = ref(false);

    const generateLinkToken = async () => {
      try {
        loading.value = true;
        const response = await api.post('/plaid/link/token');
        linkToken.value = response.data.link_token;
        initializePlaidLink(linkToken.value);
      } catch (error) {
        console.error('Error generating link token:', error);
      } finally {
        loading.value = false;
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
        loading.value = true;
        const response = await api.post('/plaid/exchange/public_token', { public_token: publicToken });
        localStorage.setItem('access_token', response.data.access_token);
        console.log('Successfully exchanged public token and saved access token.');
        fetchLinkedAccounts(response.data.access_token);
      } catch (error) {
        console.error('Error exchanging public token:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchLinkedAccounts = async (accessToken) => {
      try {
        loading.value = true;
        const response = await api.get('/plaid/accounts', {
          params: { access_token: accessToken },
        });
        accounts.value = response.data.accounts;
      } catch (error) {
        console.error('Error fetching linked accounts:', error);
      } finally {
        loading.value = false;
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
      loading,
    };
  },
};
</script>

<style scoped>
.link-bank-section {
  padding: 40px;
  background: linear-gradient(135deg, #e0f7fa, #eaf0f6);
  border-radius: 15px;
  font-family: 'Arial, sans-serif';
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.link-bank-container {
  text-align: center;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  width: 100%;
}

.header-container {
  text-align: center;
  margin-bottom: 20px;
  background-color: #007bff;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
}

.header-container h2 {
  margin: 0;
}

.date-range {
  display: flex;
  gap: 10px;
}

.date-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.fetch-data-button {
  padding: 10px 20px;
  color: #ffffff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.fetch-data-button:hover {
  background-color: #218838;
}

.link-bank-button {
  margin-top: 20px;
}

.button-icon {
  font-size: 1.5rem;
}

.link-bank-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.linked-accounts {
  margin-top: 40px;
  text-align: left;
  width: 100%;
}

.linked-accounts h3 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 20px;
}

.linked-accounts ul {
  list-style: none;
  padding: 0;
}

.linked-accounts li {
  font-size: 1.2rem;
  margin: 15px 0;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.linked-accounts li:hover {
  transform: scale(1.02);
}

.account-info {
  font-weight: bold;
  color: #004085;
}

.account-balance {
  color: #155724;
  font-weight: bold;
}

.loading-spinner {
  margin-top: 20px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
