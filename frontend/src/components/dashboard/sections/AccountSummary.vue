<template>
  <section class="account-summary-section">
    <div class="overview">
      <h2>Spending Overview</h2>
      <div class="date-selection">
        <label for="start-date">Start Date:</label>
        <input type="date" id="start-date" v-model="startDate">
        <label for="end-date">End Date:</label>
        <input type="date" id="end-date" v-model="endDate">
        <button @click="fetchTransactionsFromPlaid" class="fetch-transactions-button">Fetch Transactions</button>
      </div>
      <div class="account-selection">
        <label for="accounts">Select Account:</label>
        <select id="accounts" v-model="selectedAccount">
          <option v-for="account in accounts" :key="account.account_id" :value="account.account_id">
            {{ account.name }} ({{ account.subtype }})
          </option>
        </select>
      </div>
      <p><strong>Income:</strong> {{ totalIncome.toFixed(2) }} USD</p>
      <p><strong>Total Expenses:</strong> {{ totalExpenses.toFixed(2) }} USD</p>
      <p><strong>Net Balance:</strong> {{ netBalance.toFixed(2) }} USD</p>
    </div>

    <div class="tabs">
      <button @click="activeTab = 'spending'" :class="{ active: activeTab === 'spending' }">Spending</button>
      <button @click="activeTab = 'income'" :class="{ active: activeTab === 'income' }">Income</button>
    </div>

    <div v-if="activeTab === 'spending'" class="spending-container">
      <div class="spending-table">
        <h3>Spending by Category</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(amount, category) in categorySpending" :key="category">
              <td>{{ category }}</td>
              <td>{{ amount.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pie-chart">
        <h3>Spending by Category</h3>
        <canvas ref="categoryPieChartRef"></canvas>
      </div>
    </div>

    <div v-if="activeTab === 'income'" class="income-table">
      <h3>Income Sources</h3>
      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(amount, source) in incomeSources" :key="source">
            <td>{{ source }}</td>
            <td>{{ amount.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart } from 'chart.js/auto';
import api from '../../../api';

export default {
  name: 'AccountSummary',
  setup() {
    const totalIncome = ref(0);
    const totalExpenses = ref(0);
    const netBalance = ref(0);
    const categorySpending = ref({});
    const incomeSources = ref({});
    const startDate = ref('');
    const endDate = ref('');
    const accounts = ref([]);
    const selectedAccount = ref(null);
    const activeTab = ref('spending');

    const categoryPieChartRef = ref(null);
    let categoryPieChart = null;

    const fetchAccounts = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found. Please link your bank account.');
          return;
        }

        const response = await api.get('/plaid/accounts', {
          params: { access_token: accessToken },
        });

        accounts.value = response.data.accounts;
        if (accounts.value.length > 0) {
          selectedAccount.value = accounts.value[0].account_id;
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    const fetchTransactionsFromPlaid = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found. Please link your bank account.');
          return;
        }

        if (!startDate.value || !endDate.value) {
          console.error('Please select both start and end dates.');
          return;
        }

        // Fetching the transactions from Plaid using selected start and end dates
        const response = await api.get('/plaid/transactions', {
          params: {
            access_token: accessToken,
            start_date: startDate.value,
            end_date: endDate.value,
          },
        });

        console.log('Fetched Transactions:', response.data);

        const transactions = response.data.transactions;

        let income = 0;
        let expenses = 0;
        const categories = {};
        const sources = {};

        transactions.forEach((transaction) => {
          if (transaction.account_id !== selectedAccount.value) {
            return; // Filter transactions by selected account
          }
          if (transaction.amount > 0) {
            income += parseFloat(transaction.amount);
            const source = transaction.name || 'Other Income';
            sources[source] = (sources[source] || 0) + parseFloat(transaction.amount);
          } else {
            const expense = Math.abs(parseFloat(transaction.amount));
            expenses += expense;
            transaction.category.forEach((category) => {
              if (category) {
                categories[category] = (categories[category] || 0) + expense;
              }
            });
          }
        });

        console.log('Calculated Income:', income);
        console.log('Calculated Expenses:', expenses);
        console.log('Spending by Categories:', categories);
        console.log('Income Sources:', sources);

        totalIncome.value = income;
        totalExpenses.value = expenses;
        netBalance.value = income - expenses;
        categorySpending.value = categories;
        incomeSources.value = sources;

        // Render Charts
        renderCategoryPieChart(categories);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const renderCategoryPieChart = (categories) => {
      if (categoryPieChart) {
        categoryPieChart.destroy();
      }
      const ctx = categoryPieChartRef.value.getContext('2d');
      categoryPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(categories),
          datasets: [{
            data: Object.values(categories),
            backgroundColor: [
              '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#c9cbcf', 
              '#ff9f40', '#66ff66', '#ff6666', '#6666ff', '#ffcc00', '#ff3399', '#33ccff'
            ],
          }],
        },
        options: {
          responsive: true,
        },
      });
    };

    onMounted(() => {
      fetchAccounts();
    });

    onBeforeUnmount(() => {
      if (categoryPieChart) {
        categoryPieChart.destroy();
      }
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      startDate,
      endDate,
      accounts,
      selectedAccount,
      activeTab,
      fetchTransactionsFromPlaid,
      categorySpending,
      incomeSources,
      categoryPieChartRef,
    };
  },
};
</script>

<style scoped>
.account-summary-section {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  font-family: 'Arial, sans-serif';
}

.overview {
  margin-bottom: 20px;
}

.date-selection {
  margin-bottom: 20px;
}

.account-selection {
  margin-bottom: 20px;
}

.fetch-transactions-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.fetch-transactions-button:hover {
  background-color: #0056b3;
}

.overview p {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 5px 0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #e0e0e0;
  border: none;
  border-radius: 5px;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.spending-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.spending-table, .income-table {
  width: 45%;
  min-width: 300px;
  margin-top: 20px;
}

.pie-chart {
  width: 45%;
  min-width: 300px;
}

.spending-table table, .income-table table {
  width: 100%;
  border-collapse: collapse;
}

.spending-table th, .income-table th, .spending-table td, .income-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  color: #333; /* Ensure text is visible */
}

.spending-table th, .income-table th {
  background-color: #f2f2f2;
}

h2, h3 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

p {
  color: #333;
}
</style>
