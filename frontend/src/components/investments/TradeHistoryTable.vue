<template>
  <q-card class="table-container">
    <q-card-section>
      <div class="table-header">Trade History</div>
      <q-table
        v-if="tradeHistory.length > 0"
        :rows="tradeHistory"
        :columns="columns"
        row-key="symbol"
      />
      <div v-else class="no-data">⚠️ No trade history available</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../../api";

export default {
  setup() {
    const tradeHistory = ref([]);
    const columns = [
      { name: "symbol", label: "Symbol", field: "symbol" },
      { name: "qty", label: "Quantity", field: "qty" },
      { name: "price", label: "Price ($)", field: "price" },
      { name: "side", label: "Side", field: "side" },
      { name: "date", label: "Date", field: "date" },
    ];

    const fetchTradeHistory = async () => {
      try {
        console.log("📡 Fetching Trade History...");
        const response = await api.get("/alpaca/trade-history");

        if (!response.data || response.data.length === 0) {
          console.warn("⚠️ No trade history found.");
        }

        tradeHistory.value = response.data;
      } catch (error) {
        console.error("❌ Error fetching trade history:", error);
      }
    };

    onMounted(fetchTradeHistory);
    return { tradeHistory, columns };
  },
};
</script>

<style scoped>
.table-container {
  width: 100%;
  padding: 1rem;
}
.table-header {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}
.no-data {
  text-align: center;
  color: red;
  font-size: 1rem;
}
</style>
