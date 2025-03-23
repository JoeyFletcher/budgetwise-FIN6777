<template>
  <section class="budgeting-section">
    <div class="budgeting-container">
      <h2 class="title">📊 Budget Planning</h2>

      <!-- Tabs -->
      <div class="tabs">
        <button @click="activeTab = 'budget'" :class="{ active: activeTab === 'budget' }">
          Set Budget
        </button>
        <button @click="activeTab = 'insights'" :class="{ active: activeTab === 'insights' }">
          Insights
        </button>
      </div>

      <!-- Set Budget Section -->
      <div v-if="activeTab === 'budget'">
        <div class="controls">
          <label>Select Transaction Set:</label>
          <select v-model="selectedSet">
            <option v-for="set in savedSets" :key="set" :value="set">{{ set }}</option>
          </select>
          <button @click="loadTransactions">Load Transactions</button>
        </div>

        <!-- Budgeting Table -->
        <table v-if="categories.length">
          <thead>
            <tr>
              <th>Category</th>
              <th>Spent</th>
              <th>Budgeted</th>
              <th>Remaining</th>
              <th>% Used</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.category">
              <td>{{ cat.category }}</td>
              <td :class="cat.category === 'INCOME' ? 'income' : 'spent'">
                {{ formatCurrency(cat.spent) }}
              </td>
              <td v-if="cat.category !== 'INCOME'">
                <input type="number" v-model.number="cat.budgeted" min="0" />
                <button @click="setSuggestedBudget(cat)">🔄 Suggest</button>
              </td>
              <td v-else>—</td>
              <td v-if="cat.category !== 'INCOME'" :class="remainingClass(cat)">
                {{ formatCurrency(cat.budgeted - cat.spent) }}
              </td>
              <td v-else>—</td>
              <td v-if="cat.category !== 'INCOME'">
                {{ percentageUsed(cat) }}%
              </td>
              <td v-else>—</td>
              <td>
                <div class="progress-bar">
                  <div
                    :class="progressClass(cat)"
                    :style="{ width: percentageUsed(cat) + '%' }"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total Income</td>
              <td>{{ formatCurrency(totalIncome) }}</td>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td>Total Spent</td>
              <td>{{ formatCurrency(totalSpent) }}</td>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td>Total Budgeted</td>
              <td>{{ formatCurrency(totalBudgeted) }}</td>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td>Remaining Funds</td>
              <td :class="totalRemainingFunds >= 0 ? 'positive' : 'negative'">
                {{ formatCurrency(totalRemainingFunds) }}
              </td>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td>Non-included Spending</td>
              <td>{{ formatCurrency(nonIncludedSpending) }}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>

        <button @click="saveBudget">💾 Save Budget</button>
      </div>

      <!-- Insights Section -->
      <div v-if="activeTab === 'insights'">
        <BudgetingInsights :categories="categories" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BudgetingInsights from '../budgeting/BudgetingInsights.vue'; // ✅ Correct Import Path
import api from '../../../api';

const savedSets = ref([]);
const selectedSet = ref('');
const transactions = ref([]);
const categories = ref([]);
const activeTab = ref('budget'); // Default to Budget Tab

// Fetch saved transaction sets
onMounted(async () => {
  const { data } = await api.get('/plaid/transactions/saved-sets');
  savedSets.value = data.sets;
});

// Load Transactions and Categories
const loadTransactions = async () => {
  if (!selectedSet.value) return alert('Select a set first.');

  const { data } = await api.get('/plaid/transactions/saved', {
    params: { setName: selectedSet.value }
  });
  transactions.value = data.transactions;

  const catMap = {};
  transactions.value.forEach(({ category, amount, included }) => {
    if (!included) return;
    if (!catMap[category]) catMap[category] = { spent: 0, budgeted: 0 };
    catMap[category].spent += amount;
  });

  categories.value = Object.entries(catMap).map(([category, data]) => ({
    category,
    spent: category === 'INCOME' ? data.spent : Math.abs(data.spent),
    budgeted: category === 'INCOME' ? data.spent : data.spent * 1.1 // Default to 110% of past spending
  }));
};

// Computed values
const totalIncome = computed(() => categories.value.find(c => c.category === 'INCOME')?.spent || 0);
const totalSpent = computed(() => categories.value.filter(c => c.category !== 'INCOME').reduce((sum, c) => sum + c.spent, 0));
const totalBudgeted = computed(() => categories.value.filter(c => c.category !== 'INCOME').reduce((sum, c) => sum + c.budgeted, 0));
const totalRemainingFunds = computed(() => totalIncome.value - totalSpent.value);
const nonIncludedSpending = computed(() => transactions.value.filter(tx => !tx.included && tx.category !== 'INCOME').reduce((sum, tx) => sum + Math.abs(tx.amount), 0));

// Methods
const percentageUsed = (cat) => (cat.budgeted ? Math.round((cat.spent / cat.budgeted) * 100) : 0);
const progressClass = (cat) => percentageUsed(cat) > 100 ? 'over' : 'under';
const formatCurrency = (val) => `$${val.toFixed(2)}`;
const setSuggestedBudget = (cat) => cat.budgeted = cat.spent * 1.1;
const remainingClass = (cat) => (cat.budgeted - cat.spent) >= 0 ? 'positive' : 'negative';

const saveBudget = async () => {
  await api.post('/budget/save', { budget: categories.value });
  alert('Budget saved!');
};
</script>

<style scoped>
/* General Section */
.budgeting-section {
  padding: 20px;
  background-color: #f0f2f5; /* Light gray background */
  border-radius: 10px;
  color: #333; /* Darker text for better contrast */
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background: #ddd;
  color: #333;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
  margin: 0 5px;
  border-radius: 5px;
}

.tabs .active {
  background: #007BFF;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

th {
  background-color: #007BFF;
  color: white;
  padding: 12px;
  font-weight: bold;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  color: #222; /* Darker text */
}

/* Budget Inputs */
input[type="number"] {
  width: 80px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f8f9fa; /* Slight gray to prevent blending */
  color: #222; /* Darker text */
}

/* Buttons */
button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

button:hover {
  background-color: #0056b3;
}

/* Status Colors */
.positive {
  color: #28a745;
  font-weight: bold;
}

.negative {
  color: #dc3545;
  font-weight: bold;
}

.spent {
  color: #444; /* Dark gray for readability */
}

.income {
  color: #17a2b8;
  font-weight: bold;
}

/* Progress Bars */
.progress-bar {
  width: 100px;
  height: 10px;
  background: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar div {
  height: 100%;
  transition: width 0.3s;
}

.over {
  background: #dc3545;
}

.under {
  background: #28a745;
}
</style>
