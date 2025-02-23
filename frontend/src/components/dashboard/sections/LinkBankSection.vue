<template>
  <section class="link-bank-section">
    <div class="link-bank-container">
      <div class="header-container">
        <h2>Link Your Bank Account</h2>
      </div>

      <button @click="generateLinkToken" class="link-bank-button">
        Connect Your Bank Account
      </button>

      <div v-if="accounts && accounts.length > 0" class="linked-accounts">
        <h3>Linked Accounts</h3>
        <ul>
          <li v-for="account in accounts" :key="account.account_id" class="account-item">
            <div class="account-info">
              <strong>{{ account.name || 'Unnamed Account' }}</strong> - {{ account.subtype || 'Unknown Type' }}
            </div>
            <div class="account-balance">
              Balance: {{ account.balances?.current ? account.balances.current.toFixed(2) : 'N/A' }} USD
            </div>
          </li>
        </ul>
      </div>
      
      <div v-else-if="loading">
        <p>Loading linked accounts...</p>
      </div>

      <div v-else>
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
    const accounts = ref([]); // ✅ Ensure it's always an array
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
            console.log('✅ Plaid Link Success:', metadata);
            await exchangePublicToken(public_token);
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
        console.log('✅ Exchanged public token, now fetching accounts...');
        await fetchLinkedAccounts(response.data.access_token);
      } catch (error) {
        console.error('❌ Error exchanging public token:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchLinkedAccounts = async (accessToken) => {
      try {
        loading.value = true;
        console.log('📡 Fetching linked accounts...');

        const response = await api.get('/plaid/accounts', {
          params: { access_token: accessToken },
        });

        if (!response.data || !Array.isArray(response.data)) {
          console.warn('⚠️ Unexpected accounts response:', response.data);
          accounts.value = [];
        } else {
          accounts.value = response.data;
          console.log('✅ Linked Accounts:', accounts.value);
        }
      } catch (error) {
        console.error('❌ Error fetching linked accounts:', error);
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

      // Automatically fetch accounts if access token is stored
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        fetchLinkedAccounts(storedToken);
      }
    });

    return {
      generateLinkToken,
      accounts,
      loading,
    };
  },
};
</script>
