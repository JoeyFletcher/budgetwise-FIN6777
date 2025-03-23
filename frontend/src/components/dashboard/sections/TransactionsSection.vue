<template>
  <section class="transactions-section">
    <div class="transactions-container">
      <div class="header-container">
        <h2>Transaction History</h2>
        <button @click="fetchTransactions" class="refresh-button" :disabled="loading">
          <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i> Refresh
        </button>
      </div>

      <!-- 🔹 Save Transactions with Unique Name -->
      <div class="save-container">
        <input v-model="saveName" placeholder="Enter Save Name..." class="save-input" />
        <button @click="saveTransactions" class="save-button">
          <i class="fas fa-save"></i> Save Transactions
        </button>
      </div>

      <!-- 🔹 Filters: Search & Date Range -->
      <div class="filters">
        <input v-model="searchQuery" placeholder="Search Transactions..." class="search-bar" />
        <label class="filter-label">Date Range:</label>
        <input type="date" v-model="startDate" class="date-input" />
        <input type="date" v-model="endDate" class="date-input" />
      </div>

      <!-- 🔹 Transactions Table -->
      <table v-if="startDate && endDate && filteredTransactions.length > 0" class="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            <th>Amount ($)</th>
            <th>Include?</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="txn in filteredTransactions" :key="txn.transaction_id">
            <td>{{ txn.date }}</td>
            <td>{{ txn.merchant }}</td>
            <td>{{ txn.category }}</td>
            <td :class="{ 'positive-amount': txn.amount > 0, 'negative-amount': txn.amount < 0 }">
              {{ txn.amount.toFixed(2) }}
            </td>
            <td><input type="checkbox" v-model="txn.included" /></td>
          </tr>
        </tbody>
      </table>

      <div v-if="startDate && endDate && filteredTransactions.length === 0" class="no-data">
        No transactions found for the selected date range.
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import api from "../../../api";

export default {
  name: "TransactionsSection",
  setup() {
    const transactions = ref([]);
    const searchQuery = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const saveName = ref(""); // ✅ Added Save Name Input
    const loading = ref(false);

    // ✅ Fetch Transactions from Backend
    const fetchTransactions = async () => {
      if (!startDate.value || !endDate.value) return;
      loading.value = true;

      try {
        console.log("📡 Fetching transactions...");
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
        }));

        console.log("✅ Transactions fetched:", transactions.value);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      }

      loading.value = false;
    };

    // ✅ Save Transactions with Unique Name
    const saveTransactions = async () => {
      if (!saveName.value.trim()) {
        alert("⚠️ Please enter a save name.");
        return;
      }

      try {
        const selectedTransactions = transactions.value.filter(txn => txn.included);
        console.log("💾 Saving transactions as:", saveName.value, selectedTransactions);

        await api.post("/plaid/transactions/save", { 
          saveName: saveName.value, 
          transactions: selectedTransactions 
        });

        alert("✅ Transactions saved successfully!");
      } catch (error) {
        console.error("❌ Error saving transactions:", error);
        alert("Error saving transactions.");
      }
    };

    // ✅ Filter Transactions Based on Search & Date Range
    const filteredTransactions = computed(() => {
      return transactions.value
        .filter(txn => txn.merchant.toLowerCase().includes(searchQuery.value.toLowerCase()))
        .filter(txn => !startDate.value || txn.date >= startDate.value)
        .filter(txn => !endDate.value || txn.date <= endDate.value);
    });

    onMounted(fetchTransactions);

    return {
      transactions,
      searchQuery,
      startDate,
      endDate,
      saveName,
      fetchTransactions,
      saveTransactions,
      filteredTransactions,
      loading,
    };
  },
};
</script>

<style scoped>
.transactions-section {
  padding: 40px;
  background: linear-gradient(135deg, #e3f2fd, #e0f7fa);
  border-radius: 10px;
  font-family: "Arial, sans-serif";
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.transactions-container {
  text-align: center;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: auto;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.refresh-button, .save-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
}

.save-button i {
  margin-right: 5px;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
  color: #333;
}

.search-bar,
.date-input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transactions-table th,
.transactions-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  color: #333;
}

.transactions-table th {
  background-color: #007bff;
  color: white;
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
  color: #666;
}
</style>
