<template>
  <section class="account-summary-section">
    <div class="overview">
      <h2>Spending Overview</h2>
      <p><strong>Income:</strong> {{ totalIncome }} USD</p>
      <p><strong>Total Expenses:</strong> {{ totalExpenses }} USD</p>
      <p><strong>Net Balance:</strong> {{ netBalance }} USD</p>
    </div>

    <div class="charts">
      <div class="pie-chart">
        <h3>Spending by Category</h3>
        <canvas id="categoryPieChart"></canvas>
      </div>
      <div class="bar-chart">
        <h3>Income vs. Expenses</h3>
        <canvas id="incomeExpenseBarChart"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';
import { getPlaidTransactions } from '../../../api';

export default {
  name: 'AccountSummary',
  setup() {
    const totalIncome = ref(0);
    const totalExpenses = ref(0);
    const netBalance = ref(0);
    const categorySpending = ref({});

    const fetchTransactionsFromPlaid = async () => {
      try {
        // Assuming access_token is stored in local storage after linking account
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('No access token found. Please link your bank account.');
          return;
        }

        // Fetching the transactions from Plaid using start and end dates
        const response = await getPlaidTransactions(accessToken, '2023-01-01', new Date().toISOString().split('T')[0]);
        console.log('Fetched Transactions:', response.data);

        const transactions = response.data.transactions;

        let income = 0;
        let expenses = 0;
        const categories = {};

        transactions.forEach((transaction) => {
          if (transaction.amount > 0) {
            income += parseFloat(transaction.amount);
          } else {
            const expense = Math.abs(parseFloat(transaction.amount));
            expenses += expense;
            const category = transaction.category[0] || 'Other';
            categories[category] = (categories[category] || 0) + expense;
          }
        });

        console.log('Calculated Income:', income);
        console.log('Calculated Expenses:', expenses);
        console.log('Spending by Categories:', categories);

        totalIncome.value = income;
        totalExpenses.value = expenses;
        netBalance.value = income - expenses;
        categorySpending.value = categories;

        // Render Charts
        renderCategoryPieChart(categories);
        renderIncomeExpenseBarChart(income, expenses);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const renderCategoryPieChart = (categories) => {
      const ctx = document.getElementById('categoryPieChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(categories),
          datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#c9cbcf'],
          }],
        },
        options: {
          responsive: true,
        },
      });
    };

    const renderIncomeExpenseBarChart = (income, expenses) => {
      const ctx = document.getElementById('incomeExpenseBarChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses'],
          datasets: [{
            label: 'USD',
            data: [income, expenses],
            backgroundColor: ['#4caf50', '#f44336'],
          }],
        },
        options: {
          responsive: true,
        },
      });
    };

    onMounted(() => {
      fetchTransactionsFromPlaid();
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      fetchTransactionsFromPlaid,
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

.overview p {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 5px 0;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
}

.pie-chart, .bar-chart {
  width: 45%;
  min-width: 300px;
}

canvas {
  max-width: 100%;
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
