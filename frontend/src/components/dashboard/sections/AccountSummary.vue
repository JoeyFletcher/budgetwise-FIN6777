<template>
  <section class="account-summary">
    <h1>Welcome to Your Dashboard</h1>
    <div class="tile-container">
      
      <!-- Transactions Tile -->
      <div class="tile transactions" @click="selectSection('transactions')">
        <h2>Transactions</h2>
        <p v-if="latestTransaction">
          Last: {{ latestTransaction.merchant }} - ${{ latestTransaction.amount }}
        </p>
        <p v-else>No recent transactions</p>
      </div>

      <!-- Budgeting Tile -->
      <div class="tile budgeting" @click="selectSection('budgeting')">
        <h2>Budgeting</h2>
        <p v-if="budgetData">
          Remaining: ${{ budgetData.remaining ?? '0.00' }}
        </p>
        <p v-else>No budget data</p>
      </div>

      <!-- Investments Tile -->
      <div class="tile investments" @click="selectSection('investments')">
        <h2>Investments</h2>
        <p v-if="portfolioValue !== null">
          Portfolio: ${{ portfolioValue?.toFixed(2) ?? '0.00' }}
        </p>
        <p v-else>No investment data</p>
      </div>

      <!-- Linked Accounts Tile -->
      <div class="tile link-accounts" @click="selectSection('linkBank')">
        <h2>Linked Accounts</h2>
        <p v-if="linkedAccounts.length > 0">
          {{ linkedAccounts.length }} Accounts
        </p>
        <p v-else>No accounts linked</p>
      </div>

      <!-- Account Settings Tile -->
      <div class="tile account-settings" @click="selectSection('accountSettings')">
        <h2>Account Settings</h2>
        <p>Manage Preferences & Security</p>
      </div>

    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'AccountSummary',
  emits: ['option-selected'], // ✅ Ensure event is emitted
  setup(_, { emit }) {
    const latestTransaction = ref(null);
    const budgetData = ref(null);
    const portfolioValue = ref(null);
    const linkedAccounts = ref([]);

    // ✅ Correctly emits event to DashboardPage.vue
    const selectSection = (section) => {
      console.log(`📌 Emitting event for section: ${section}`);
      emit('option-selected', section);
    };

    onMounted(() => {
      console.log("✅ AccountSummary mounted!");
    });

    return {
      selectSection,
      latestTransaction,
      budgetData,
      portfolioValue,
      linkedAccounts
    };
  }
};
</script>

<style scoped>
.account-summary {
  text-align: center;
  padding: 40px;
}

.tile-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tile {
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tile:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

/* Tile Colors */
.transactions { background: #007bff; }
.budgeting { background: #28a745; }
.investments { background: #fd7e14; }
.link-accounts { background: #6c757d; }
.account-settings { background: #6f42c1; }

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

h2 {
  margin: 0 0 10px;
}

p {
  font-size: 1.2rem;
}
</style>
