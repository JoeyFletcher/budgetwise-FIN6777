<template>
    <div class="budgeting-insights">
      <h2>📊 Budget Insights</h2>
  
      <!-- Dropdown to select insight -->
      <div class="dropdown-container">
        <label for="insight-select">Select Insight:</label>
        <select id="insight-select" v-model="selectedInsight">
          <option value="budgetAllocation">Budget Allocation</option>
          <option value="actualVsBudgeted">Actual vs Budgeted</option>
          <option value="spendingTrends">Spending Trends</option>
        </select>
      </div>
  
      <!-- Conditional rendering based on selected insight -->
      <div class="chart-container" v-if="selectedInsight === 'budgetAllocation'">
        <h3>Budget Allocation</h3>
        <canvas ref="budgetPieChart"></canvas>
      </div>
  
      <div class="chart-container" v-if="selectedInsight === 'actualVsBudgeted'">
        <h3>Actual vs Budgeted</h3>
        <canvas ref="budgetBarChart"></canvas>
      </div>
  
      <div class="chart-container" v-if="selectedInsight === 'spendingTrends'">
        <h3>Spending Trends</h3>
        <canvas ref="spendingTrendChart"></canvas>
      </div>
  
      <!-- Summary Section -->
      <div class="summary">
        <h3>Key Metrics</h3>
        <ul>
          <li><strong>Total Budgeted:</strong> {{ formatCurrency(totalBudgeted) }}</li>
          <li><strong>Total Spent:</strong> {{ formatCurrency(totalSpent) }}</li>
          <li :class="totalRemaining >= 0 ? 'positive' : 'negative'">
            <strong>Remaining Balance:</strong> {{ formatCurrency(totalRemaining) }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, nextTick, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  // Props from BudgetingSection
  const props = defineProps({
    categories: Array
  });
  
  // Selected insight from dropdown
  const selectedInsight = ref('budgetAllocation'); // Default selection
  
  // Chart references
  const budgetPieChart = ref(null);
  const budgetBarChart = ref(null);
  const spendingTrendChart = ref(null);
  
  let pieChartInstance = null;
  let barChartInstance = null;
  let trendChartInstance = null;
  
  // Computed Values
  const totalBudgeted = computed(() => props.categories.filter(c => c.category !== 'INCOME').reduce((sum, c) => sum + c.budgeted, 0));
  const totalSpent = computed(() => props.categories.filter(c => c.category !== 'INCOME').reduce((sum, c) => sum + c.spent, 0));
  const totalRemaining = computed(() => totalBudgeted.value - totalSpent.value);
  
  // Function to render charts based on selection
  const renderChart = async () => {
    await nextTick();
  
    // Destroy previous chart instances to avoid duplication
    if (pieChartInstance) pieChartInstance.destroy();
    if (barChartInstance) barChartInstance.destroy();
    if (trendChartInstance) trendChartInstance.destroy();
  
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  
    if (selectedInsight.value === 'budgetAllocation') {
      // 🎨 Pie Chart: Budget Allocation
      pieChartInstance = new Chart(budgetPieChart.value, {
        type: 'pie',
        data: {
          labels: props.categories.map(cat => cat.category),
          datasets: [{
            data: props.categories.map(cat => cat.budgeted),
            backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0']
          }]
        },
        options: chartOptions
      });
    } else if (selectedInsight.value === 'actualVsBudgeted') {
      // 📊 Bar Chart: Actual vs Budgeted
      barChartInstance = new Chart(budgetBarChart.value, {
        type: 'bar',
        data: {
          labels: props.categories.map(cat => cat.category),
          datasets: [
            {
              label: 'Spent',
              data: props.categories.map(cat => cat.spent),
              backgroundColor: '#F44336'
            },
            {
              label: 'Budgeted',
              data: props.categories.map(cat => cat.budgeted),
              backgroundColor: '#4CAF50'
            }
          ]
        },
        options: chartOptions
      });
    } else if (selectedInsight.value === 'spendingTrends') {
      // 📈 Line Chart: Spending Trends
      trendChartInstance = new Chart(spendingTrendChart.value, {
        type: 'line',
        data: {
          labels: props.categories.map(cat => cat.category),
          datasets: [
            {
              label: 'Spending Trend',
              data: props.categories.map(cat => cat.spent),
              borderColor: '#007BFF',
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              fill: true
            }
          ]
        },
        options: chartOptions
      });
    }
  };
  
  // Watch for changes and update charts dynamically
  watch(selectedInsight, () => renderChart());
  
  // Run on mount
  onMounted(() => {
    renderChart();
  });
  
  // Formatting Helper
  const formatCurrency = (val) => `$${val.toFixed(2)}`;
  </script>
  
  <style scoped>
  .budgeting-insights {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: #222;
    max-width: 100%;
  }
  
  /* Dropdown Container */
  .dropdown-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
    margin-right: 10px;
  }
  
  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #f8f9fa;
    color: #222;
    font-size: 16px;
    cursor: pointer;
    width: 200px;
  }
  
  /* Chart Container */
  .chart-container {
    margin: 20px auto;
    width: 95%;
    max-width: 800px; /* Allow for larger screens */
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  canvas {
    width: 100% !important;
    height: 400px !important;
  }
  
  /* Summary Section */
  .summary {
    margin-top: 20px;
    text-align: center;
    padding: 15px;
    background: #e9ecef;
    border-radius: 10px;
    color: #333;
    font-weight: bold;
  }
  
  .summary ul {
    list-style-type: none;
    padding: 0;
  }
  
  .summary li {
    font-size: 18px;
    margin: 10px 0;
    color: #222;
  }
  
  /* Highlight Colors */
  .positive {
    color: #28a745;
  }
  
  .negative {
    color: #dc3545;
  }
  </style>
  