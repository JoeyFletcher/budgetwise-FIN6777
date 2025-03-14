<template>
  <section class="budgeting-section">
    <div class="budgeting-container">
      <h2 class="title">📊 Budget Planning</h2>

      <!-- Select Transaction Set -->
      <div class="controls">
        <label for="savedSet">Select Transaction Set:</label>
        <select v-model="selectedSet" id="savedSet" class="dropdown">
          <option v-for="set in savedSets" :key="set" :value="set">{{ set }}</option>
        </select>

        <button @click="loadSavedTransactions" class="load-button">
          <i class="fas fa-sync-alt"></i> Load Transactions
        </button>
      </div>

      <table class="transactions-table" v-if="Object.keys(categoryBudgets).length">
        <thead>
          <tr>
            <th>Category</th>
            <th>Actual Spending</th>
            <th>Budget</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(budget, category) in categoryBudgets" :key="category" :class="{ 'income-row': category === 'INCOME' }">
            <td class="category-name">{{ category }}</td>

            <td :class="category === 'INCOME' ? 'income-amount' : 'spending-amount'">
              ${{ Math.abs(budget.spent).toFixed(2) }}
            </td>

            <td>
              <input
                v-if="category !== 'INCOME'"
                type="number"
                class="budget-input"
                v-model.number="budget.budgeted"
              />
              <span v-else>—</span>
            </td>

            <td :class="{
              'remaining-positive': (budget.budgeted - Math.abs(budget.spent)) >= 0,
              'remaining-negative': budget.budgeted - Math.abs(budget.spent) < 0
            }">
              {{ category !== 'INCOME' ? `$${(budget.budgeted - Math.abs(budget.spent)).toFixed(2)}` : '—' }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="summary-row">
            <td><strong>Total Income</strong></td>
            <td>${{ totalIncome.toFixed(2) }}</td>
            <td colspan="2"></td>
          </tr>
          <tr class="summary-row">
            <td><strong>Total Budgeted</strong></td>
            <td colspan="3">${{ totalBudgeted.toFixed(2) }}</td>
          </tr>
          <tr class="summary-row">
            <td><strong>Total Remaining Funds</strong></td>
            <td colspan="3" :class="totalRemainingFunds >= 0 ? 'remaining-positive' : 'remaining-negative'">
              ${{ totalRemainingFunds.toFixed(2) }}
            </td>
          </tr>
          <tr class="summary-row">
            <td><strong>Total Non-Included Spending</strong></td>
            <td colspan="3">${{ totalNonIncludedSpending.toFixed(2) }}</td>
          </tr>
        </tfoot>
      </table>

      <button @click="saveBudget" class="save-button">
        <i class="fas fa-save"></i> Save Budget
      </button>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from '../../../api';

export default {
  name: "BudgetingSection",
  setup() {
    const savedSets = ref([]);
    const selectedSet = ref("");
    const savedTransactions = ref([]);
    const categoryBudgets = ref({});

    const fetchSavedSets = async () => {
      const { data } = await api.get("/plaid/transactions/saved-sets");
      savedSets.value = data.sets;
    };

    const loadSavedTransactions = async () => {
      if (!selectedSet.value) return;

      const { data } = await api.get("/plaid/transactions/saved", { params: { setName: selectedSet.value } });
      savedTransactions.value = data.transactions;

      const budgets = {};
      data.transactions.forEach(({ category, amount, included }) => {
        if (!budgets[category]) budgets[category] = { spent: 0, budgeted: 0 };
        if (included) budgets[category] = budgets[category] || { spent: 0, budgeted: 0 };
        if (included) budgets[category].spent += amount;
      });
      categoryBudgets.value = budgets;
    };

    const totalIncome = computed(() => categoryBudgets.value["INCOME"]?.spent || 0);
    const totalBudgeted = computed(() => Object.values(categoryBudgets.value).reduce((sum, { budgeted }) => sum + (budgeted || 0), 0));
    const totalRemainingFunds = computed(() => totalIncome.value - totalBudgeted.value);
    const totalNonIncludedSpending = computed(() => savedTransactions.value
      .filter(tx => !tx.included && tx.category !== "INCOME")
      .reduce((acc, { amount }) => acc + Math.abs(amount), 0));

    const saveBudget = () => api.post("/budget/save", { budgets: categoryBudgets.value });

    onMounted(fetchSavedSets);

    const formatCategory = (str) => str.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

    return {
      savedSets,
      selectedSet,
      savedTransactions,
      categoryBudgets,
      totalIncome,
      totalBudgeted,
      totalRemainingFunds: computed(() => totalIncome.value - totalBudgeted.value),
      totalNonIncludedSpending,
      fetchSavedSets,
      loadSavedTransactions,
      saveBudget,
      formatCategory: cat => cat.replace(/_/g, ' ').toUpperCase()
    };
  },
};
</script>

<style scoped>
.budgeting-section {
  padding: 40px;
  background: #f0f8ff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.dropdown, .budget-input {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.load-button, .save-button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin: 10px;
}

.remaining-positive { color: green; }
.remaining-negative { color: red; }

.summary-row td {
  background-color: #f8f9fa;
  font-weight: bold;
}

.category-name { text-transform: capitalize; }
</style>
