<template>
    <section class="transactions-section">
      <div class="transactions-container">
        <div class="header-container">
          <h2>Transaction History</h2>
          <button @click="fetchTransactions" class="refresh-button">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
  
        <!-- 🔹 Filters: Search & Date Range -->
        <div class="filters">
          <input v-model="searchQuery" placeholder="Search Transactions..." class="search-bar" />
  
          <label class="filter-label">Date Range:</label>
          <input type="date" v-model="startDate" class="date-input" />
          <input type="date" v-model="endDate" class="date-input" />
        </div>
  
        <!-- 🔹 No Transactions Message -->
        <div v-if="!startDate || !endDate" class="no-data">
          Please select a date range to view transactions.
        </div>
  
        <!-- 🔹 Transactions Table -->
        <table v-if="startDate && endDate" class="transactions-table">
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
            <tr v-for="(txn, index) in filteredTransactions" :key="index">
              <td>{{ txn.date }}</td>
              <td>{{ txn.merchant || 'Unknown' }}</td>
  
              <!-- 🔹 Editable Category Dropdown (Auto-Populates with Plaid Default) -->
              <td>
                <select v-model="txn.category" @change="updateCategory(index, txn)">
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </td>
  
              <!-- 🔹 Colored Amount Display -->
              <td :class="{ 'positive-amount': txn.amount > 0, 'negative-amount': txn.amount < 0 }">
                {{ txn.amount.toFixed(2) }}
              </td>
  
              <!-- 🔹 Include/Exclude Checkbox (But Keeps Transaction Visible) -->
              <td>
                <input type="checkbox" v-model="txn.included" />
              </td>
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
  
      // 🔹 List of Available Categories
      const categories = ref([
        "Food and Drink",
        "Travel",
        "Shopping",
        "Income",
        "Bills & Utilities",
        "Entertainment",
        "Uncategorized"
      ]);
  
      // 🔹 Fetch Transactions
      const fetchTransactions = async () => {
        if (!startDate.value || !endDate.value) return;
        try {
          console.log("📡 Fetching transactions...");
          const accessToken = localStorage.getItem("access_token");
          if (!accessToken) {
            console.warn("No access token found.");
            return;
          }
  
          const response = await api.get("/plaid/transactions", {
            params: {
              access_token: accessToken,
              start_date: startDate.value,
              end_date: endDate.value,
            },
          });
  
          transactions.value = response.data.map(txn => ({
            ...txn,
            included: true, // Default to included
            category: txn.category?.[0] || getCategoryFromPlaidId(txn.category_id) || "Uncategorized" // ✅ FIXED: Now Auto-populating
          }));
  
          console.log("✅ Transactions fetched:", transactions.value);
        } catch (error) {
          console.error("❌ Error fetching transactions:", error);
        }
      };
  
      // 🔹 Convert Plaid's `category_id` to Readable Category
      const getCategoryFromPlaidId = (categoryId) => {
        const plaidCategories = {
          "13005000": "Food and Drink",
          "22010000": "Travel",
          "21009000": "Income",
          "18000000": "Shopping",
          "19000000": "Bills & Utilities",
          "20000000": "Entertainment"
        };
        return plaidCategories[categoryId] || "Uncategorized";
      };
  
      // 🔹 Save Category Changes
      const updateCategory = async (index, txn) => {
        try {
          console.log(`📡 Updating category for transaction ${txn.transaction_id}...`);
          transactions.value[index].category = txn.category;
          console.log(`✅ Updated category: ${txn.category}`);
        } catch (error) {
          console.error("❌ Error updating category:", error);
        }
      };
  
      // 🔹 Filtered Transactions Based on Search & Date
      const filteredTransactions = computed(() => {
        return transactions.value
          .filter(txn => txn.merchant.toLowerCase().includes(searchQuery.value.toLowerCase()))
          .filter(txn => !startDate.value || txn.date >= startDate.value)
          .filter(txn => !endDate.value || txn.date <= endDate.value);
      });
  
      onMounted(() => {
        console.log("🟢 Transactions Section Mounted");
      });
  
      return {
        transactions,
        searchQuery,
        startDate,
        endDate,
        categories,
        fetchTransactions,
        updateCategory,
        filteredTransactions
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
  
  .header-container h2 {
    margin: 0;
    color: #333;
  }
  
  .refresh-button {
    background: none;
    border: none;
    color: #007bff;
    font-size: 1rem;
    cursor: pointer;
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
  