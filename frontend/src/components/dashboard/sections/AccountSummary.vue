<template>
  <section class="account-summary-section">
    <div class="overview-header">
      <h2>Account Summary Overview</h2>
      <div class="date-selection">
        <input type="date" id="start-date" v-model="startDate" class="date-input">
        <input type="date" id="end-date" v-model="endDate" class="date-input">
        <button @click="fetchTransactions" class="fetch-transactions-button">Fetch Transactions</button>
      </div>
    </div>
    <div class="overview-horizontal">
      <p><strong>Income:</strong> {{ formatCurrency(totalIncome) }}</p>
      <p><strong>Total Expenses:</strong> {{ formatCurrency(totalExpenses) }}</p>
      <p><strong>Net Balance:</strong> {{ formatCurrency(netBalance) }}</p>
    </div>

    <div class="spending-container-centered">
      <h3 class="spending-title">Spending by Category</h3>
      <div class="spending-content">
        <div class="spending-table">
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
                <td>{{ formatCurrency(amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pie-chart">
          <canvas ref="categoryPieChartRef"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart } from 'chart.js/auto';
import { getTransactionSummary, getSpendingByCategory } from '../../../api';

export default {
  name: 'AccountSummary',
  setup() {
    const totalIncome = ref(0);
    const totalExpenses = ref(0);
    const netBalance = ref(0);
    const categorySpending = ref({});
    const startDate = ref('');
    const endDate = ref('');
    const bankAccount = ref(localStorage.getItem('bankAccount') || ''); // Using the bank account ID stored during signup

    const categoryPieChartRef = ref(null);
    let categoryPieChart = null;

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    };

    const fetchTransactions = async () => {
      // Check if bankAccount exists and is valid
      if (!bankAccount.value) {
        alert('Bank account ID is missing. Please log in again.');
        console.error('Error: bankAccount is missing.');
        return;
      }

      if (!startDate.value || !endDate.value) {
        alert('Please select both start and end dates.');
        return;
      }

      try {
        console.log('Bank Account ID:', bankAccount.value);
        console.log('Fetching transaction summary...');

        // Fetch transaction summary
        const summaryResponse = await getTransactionSummary(bankAccount.value, startDate.value, endDate.value);
        if (summaryResponse.data) {
          totalIncome.value = summaryResponse.data.totalIncome || 0;
          totalExpenses.value = summaryResponse.data.totalExpenses || 0;
          netBalance.value = totalIncome.value - Math.abs(totalExpenses.value);
        } else {
          console.error('No summary data returned from API.');
          totalIncome.value = 0;
          totalExpenses.value = 0;
          netBalance.value = 0;
        }

        console.log('Fetching spending by category...');
        // Fetch spending by category
        const categoryResponse = await getSpendingByCategory(bankAccount.value, startDate.value, endDate.value);
        if (categoryResponse.data && categoryResponse.data.categorySpending) {
          categorySpending.value = categoryResponse.data.categorySpending;
          renderCategoryPieChart(categorySpending.value);
        } else {
          console.error('No category spending data returned from API.');
          categorySpending.value = {};
          renderCategoryPieChart(categorySpending.value);
        }
      } catch (error) {
        console.error('Error fetching transactions data:', error);
        alert('An error occurred while fetching the transaction data.');
      }
    };

    const renderCategoryPieChart = (categories) => {
      if (categoryPieChart) {
        categoryPieChart.destroy();
      }

      if (Object.keys(categories).length === 0) {
        return; // No data available to render chart
      }

      const ctx = categoryPieChartRef.value.getContext('2d');
      categoryPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(categories),
          datasets: [{
            data: Object.values(categories),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 205, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(201, 203, 207, 0.7)',
              'rgba(255, 159, 64, 0.7)', 'rgba(102, 255, 102, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(201, 203, 207, 1)',
              'rgba(255, 159, 64, 1)', 'rgba(102, 255, 102, 1)'
            ],
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  const dataset = tooltipItem.dataset;
                  const index = tooltipItem.dataIndex;
                  const category = dataset.labels[index];
                  const amount = dataset.data[index];
                  const totalAmount = dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((amount / totalAmount) * 100).toFixed(2);
                  return `${category}: ${formatCurrency(amount)} (${percentage}%)`;
                }
              }
            }
          }
        },
      });
    };

    onMounted(() => {
      // Attempt to set bankAccount from local storage if not set
      if (!bankAccount.value) {
        bankAccount.value = localStorage.getItem('bankAccount');
      }
      renderCategoryPieChart(categorySpending.value);
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
      fetchTransactions,
      categorySpending,
      categoryPieChartRef,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@300;600&display=swap');

.account-summary-section {
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #f0f0f0);
  border-radius: 15px;
  font-family: 'Open Sans', sans-serif;
  max-width: 1600px;
  margin: 20px auto;
  height: 100vh;
  max-height: 750px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007bff;
  padding: 10px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.date-selection {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input {
  padding: 6px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
}

.fetch-transactions-button {
  padding: 8px 16px;
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease, background 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.fetch-transactions-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #218838, #1e7e34);
}

.overview-horizontal {
  display: flex;
  gap: 20px;
  justify-content: space-around;
  margin-top: 10px;
}

.overview-horizontal p {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.spending-container-centered {
  margin-top: 20px;
  text-align: center;
}

.spending-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  margin-bottom: 20px;
}

.spending-content {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
}

.spending-table {
  flex: 1;
  max-width: 50%;
}

.pie-chart {
  flex: 1;
  max-width: 50%;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spending-table table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background-color: #ffffff;
}

.spending-table th, .spending-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
  color: #333;
  font-family: 'Roboto', sans-serif;
}

.spending-table th {
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-family: 'Open Sans', sans-serif;
}

.spending-table tbody tr:nth-child(odd) {
  background-color: #f7f7f7;
}

.spending-table tbody tr:hover {
  background-color: #e9ecef;
  transition: background-color 0.3s ease;
}

h2, h3 {
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  font-family: 'Open Sans', sans-serif;
}

p {
  color: #333;
  font-family: 'Roboto', sans-serif;
}

.pie-chart canvas {
  width: 100% !important;
  max-width: 400px;
  height: auto !important;
  max-height: 400px;
  margin: auto;
}
</style>
