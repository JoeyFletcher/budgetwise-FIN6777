<template>
  <section class="budget-section">
    <div class="overview">
      <div class="overview-header">
        <h2>Budget Overview</h2>
        <div class="date-selection">
          <input type="date" id="start-date" v-model="startDate" class="date-input">
          <input type="date" id="end-date" v-model="endDate" class="date-input">
          <button @click="fetchBudgetData" class="fetch-budget-button">Fetch Data</button>
        </div>
      </div>
    </div>

    <div class="budget-table">
      <h3>Budget by Category</h3>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budgeted Amount (USD)</th>
              <th>Spent Amount (USD)</th>
              <th>Remaining Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(budget, category) in budgetData" :key="category">
              <td>{{ category }}</td>
              <td>
                <input type="number" v-model.number="budgetData[category].budgeted" @change="updateBudget(category)" class="budget-input">
              </td>
              <td>{{ formatCurrency(budget.spent) }}</td>
              <td>{{ formatCurrency(budget.budgeted - budget.spent) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>Total Remaining Budget (USD)</strong></td>
              <td>{{ formatCurrency(totalRemainingBudget) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from 'vue';
import { getSpendingByCategory } from '../../../api'; // Importing the API function

export default {
  name: 'BudgetSection',
  setup() {
    const startDate = ref('');
    const endDate = ref('');
    const budgetData = ref({});
    const bankAccount = ref(localStorage.getItem('bankAccount') || ''); // Get bankAccount from localStorage

    const fetchBudgetData = async () => {
      if (!startDate.value || !endDate.value) {
        alert('Please select both start and end dates.');
        return;
      }

      if (!bankAccount.value) {
        alert('Bank account ID is missing. Please log in again.');
        console.error('Error: bankAccount is missing.');
        return;
      }

      try {
        console.log('Fetching budget data for:', startDate.value, 'to', endDate.value);

        // Fetch spending by category for the selected range
        const categoryResponse = await getSpendingByCategory(bankAccount.value, startDate.value, endDate.value);
        if (categoryResponse.data && categoryResponse.data.categorySpending) {
          budgetData.value = {};
          Object.entries(categoryResponse.data.categorySpending).forEach(([category, spent]) => {
            budgetData.value[category] = {
              budgeted: budgetData.value[category]?.budgeted || 0, // Use existing budget if available
              spent: spent,
            };
          });
        } else {
          console.error('No category spending data returned from API.');
          budgetData.value = {};
        }
      } catch (error) {
        console.error('Error fetching budget data:', error);
        alert('An error occurred while fetching the budget data.');
      }
    };

    const updateBudget = (category) => {
      console.log(`Updated budget amount for ${category}:`, budgetData.value[category].budgeted);
    };

    const totalRemainingBudget = computed(() => {
      return Object.values(budgetData.value).reduce((total, budget) => {
        return total + (budget.budgeted - budget.spent);
      }, 0);
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    };

    return {
      startDate,
      endDate,
      budgetData,
      fetchBudgetData,
      updateBudget,
      totalRemainingBudget,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@300;600&display=swap');

.budget-section {
  padding: 40px;
  background: linear-gradient(135deg, #f9f9f9, #f0f0f0);
  border-radius: 15px;
  font-family: 'Open Sans', sans-serif;
  max-width: 1600px;
  margin: auto;
  overflow-y: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.overview {
  margin-bottom: 30px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007bff;
  padding: 20px;
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.date-selection {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input {
  padding: 8px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
}

.fetch-budget-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #28a745, #218838);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease, background 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.fetch-budget-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #218838, #1e7e34);
}

.budget-table {
  margin-top: 20px;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.budget-table table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background-color: #ffffff;
}

.budget-table th, .budget-table td {
  border: 1px solid #e0e0e0;
  padding: 15px;
  text-align: left;
  color: #333;
  font-family: 'Roboto', sans-serif;
}

.budget-table th {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  font-size: 1.1rem;
  font-family: 'Open Sans', sans-serif;
}

.budget-table tbody tr:nth-child(odd) {
  background-color: #f7f7f7;
}

.budget-table tbody tr:hover {
  background-color: #e9ecef;
  transition: background-color 0.3s ease;
}

.budget-input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: border-color 0.3s ease;
  font-family: 'Open Sans', sans-serif;
}

.budget-input:focus {
  border-color: #007bff;
}

h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

h3 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Open Sans', sans-serif;
}

p {
  color: #333;
  font-family: 'Roboto', sans-serif;
}
</style>
