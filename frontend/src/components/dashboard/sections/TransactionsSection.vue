<template>
  <section class="transactions-section">
    <div class="transactions-container">

      <!-- Header -->
      <div class="header-container">
        <h2>Transaction History</h2>
        <button @click="fetchTransactions" class="refresh-button" :disabled="loading">
          <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i> Refresh
        </button>
      </div>

      <!-- Filter (Month Picker) -->
      <div class="filters">
        <input v-model="selectedMonth" type="month" class="date-input" />
      </div>

      <!-- Save Button -->
      <div class="save-container">
        <button @click="saveTransactions" class="save-button" :disabled="filteredTransactions.length === 0">
          <i class="fas fa-save"></i> Save Transactions ({{ saveFileName }})
        </button>
      </div>

      <!-- Transactions Table -->
      <table v-if="filteredTransactions.length > 0" class="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Amortize Over (Months)</th>
            <th>Include?</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="txn in filteredTransactions" :key="txn.transaction_id">
            <td>{{ txn.date }}</td>
            <td>{{ txn.merchant }}</td>
            
            <!-- Editable Category -->
            <td>
              <select v-model="txn.category" class="date-input" style="width: 150px;">
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </td>

            <td :class="{ 'positive-amount': txn.amount > 0, 'negative-amount': txn.amount < 0 }">
              {{ txn.amount.toFixed(2) }}
            </td>
            <td>
              <input 
                type="number" 
                min="1" 
                v-model.number="txn.amortizationMonths" 
                class="date-input" 
                style="width: 80px; text-align: center;" 
              />
            </td>
            <td><input type="checkbox" v-model="txn.included" /></td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredTransactions.length === 0 && selectedMonth" class="no-data">
        No transactions found for the selected month.
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, watch } from "vue";
import api from "../../../api";

export default {
  name: "TransactionsSection",
  setup() {
    const transactions = ref([]);
    const selectedMonth = ref("");
    const loading = ref(false);

    const startDate = computed(() => selectedMonth.value ? `${selectedMonth.value}-01` : "");
    const endDate = computed(() => {
      if (!selectedMonth.value) return "";
      const [year, month] = selectedMonth.value.split('-');
      const lastDay = new Date(year, month, 0).getDate();
      return `${year}-${month}-${lastDay}`;
    });

    const saveFileName = computed(() => {
      if (!selectedMonth.value) return "";
      const [year, month] = selectedMonth.value.split('-');
      return `${month}_${year}_Trans`;
    });

    // Compute available categories dynamically + add "Other"
    const availableCategories = computed(() => {
      const cats = new Set(transactions.value.map(txn => txn.category));
      cats.add("OTHER");
      return Array.from(cats).sort();
    });

    const fetchTransactions = async () => {
      if (!startDate.value || !endDate.value) return;
      loading.value = true;

      try {
        const response = await api.get("/plaid/transactions/list", {
          params: {
            access_token: localStorage.getItem("access_token"),
            start_date: startDate.value,
            end_date: endDate.value,
          },
        });

        transactions.value = response.data.transactions.map(txn => ({
          transaction_id: txn.transaction_id,
          date: txn.date,
          merchant: txn.merchant || "Unknown Merchant",
          category: txn.category || "Uncategorized",
          amount: txn.amount,
          included: true,
          amortizationMonths: 1, // Default = no amortization
        }));

      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      loading.value = false;
    };

    const saveTransactions = async () => {
      if (!saveFileName.value) {
        alert("Please select a month first.");
        return;
      }
      try {
        const selectedTransactions = transactions.value.filter(txn => txn.included);

        const adjustedTransactions = selectedTransactions.map(txn => ({
          ...txn,
          amount: txn.amount / txn.amortizationMonths
        }));

        await api.post("/plaid/transactions/save", {
          saveName: saveFileName.value,
          transactions: adjustedTransactions
        });

        alert("Transactions saved successfully!");
      } catch (error) {
        console.error("Error saving transactions:", error);
        alert("Error saving transactions.");
      }
    };

    const filteredTransactions = computed(() => {
      return transactions.value;
    });

    watch(selectedMonth, () => {
      if (selectedMonth.value) fetchTransactions();
    });

    return {
      transactions,
      selectedMonth,
      saveFileName,
      fetchTransactions,
      saveTransactions,
      filteredTransactions,
      availableCategories,
      loading,
    };
  },
};
</script>

<style scoped>
.transactions-section {
  padding: 40px;
  background: linear-gradient(135deg, #f0f4f8, #e6f0fa);
  border-radius: 10px;
  font-family: "Arial, sans-serif";
  min-height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.transactions-container {
  text-align: center;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  max-width: 1000px;
  margin: auto;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.refresh-button, 
.save-button {
  background: #3399ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.refresh-button:hover, 
.save-button:hover {
  background: #287acc;
}

.save-button i {
  margin-right: 5px;
}

.filters {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  color: #333;
  flex-wrap: wrap;
}

.search-bar,
.date-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 250px;
  background: #fafafa;
  color: #333;
}

.search-bar::placeholder,
.date-input::placeholder {
  color: #999;
}

.transactions-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  border-radius: 5px;
  overflow: hidden;
}

.transactions-table th {
  background-color: #f5f7fa;
  color: #333;
  padding: 12px;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.transactions-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #333;
  background: #fff;
}

.transactions-table tr:nth-child(even) td {
  background: #fafafa;
}

.transactions-table tr:hover td {
  background: #f1f5f9;
}

.positive-amount {
  color: green;
  font-weight: bold;
}

.negative-amount {
  color: red;
  font-weight: bold;
}

.no-data {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #999;
}

button, input {
  transition: all 0.2s ease-in-out;
}

.header-container h2 {
  color: #333;
}
</style>
