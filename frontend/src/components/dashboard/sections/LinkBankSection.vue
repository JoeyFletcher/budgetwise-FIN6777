<template>
  <section class="link-bank-section">
    <div class="link-bank-container">
      <div class="header-container">
        <h2>Link Your Bank Account</h2>
      </div>

      <button @click="generateLinkToken" class="link-bank-button">
        <i class="fas fa-link"></i> Connect Your Bank Account
      </button>

      <div v-if="accounts && accounts.length > 0" class="linked-accounts">
        <h3>Linked Accounts</h3>
        <div class="account-list">
          <div v-for="account in accounts" :key="account.account_id" class="account-card">
            <div class="account-header">
              <i class="fas fa-university"></i>
              <span>{{ account.name || 'Unnamed Account' }}</span>
            </div>
            <div class="account-details">
              <p><strong>Type:</strong> {{ account.subtype || 'Unknown' }}</p>
              <p><strong>Balance:</strong> {{ account.balances?.current ? account.balances.current.toFixed(2) : 'N/A' }} USD</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="loading-message">
        <p>Loading linked accounts...</p>
      </div>

      <div v-else class="no-accounts">
        <p>No linked accounts found. Try reconnecting.</p>
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
          onSuccess: async (public_token, metadata) => {
            await exchangePublicToken(public_token);
          },
          onExit: (err) => {
            if (err) console.error('Error with Plaid Link:', err);
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
        await fetchLinkedAccounts(response.data.access_token);
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
        accounts.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching linked accounts:', error);
        accounts.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const plaidScript = document.createElement('script');
      plaidScript.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      plaidScript.async = true;
      document.head.appendChild(plaidScript);
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) fetchLinkedAccounts(storedToken);
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
  text-align: center;
  padding: 40px;
}

.link-bank-container {
  max-width: 900px;
  margin: auto;
  padding: 30px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.header-container h2 {
  color: #fff;
  margin-bottom: 20px;
}

.link-bank-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.link-bank-button:hover {
  background-color: #0056b3;
}

.linked-accounts h3 {
  color: #fff;
  margin-top: 20px;
}

.account-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.account-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 15px;
  border-radius: 10px;
  transition: transform 0.2s;
}

.account-card:hover {
  transform: scale(1.05);
}

.account-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #fff;
}

.account-details {
  color: #ddd;
  font-size: 1rem;
  margin-top: 8px;
}

.loading-message, .no-accounts {
  color: #ccc;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
