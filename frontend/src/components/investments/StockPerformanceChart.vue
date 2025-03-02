<template>
  <q-card class="chart-container">
    <q-card-section>
      <div class="chart-header">Stock Performance</div>
      <q-select 
        v-model="selectedStock"
        :options="stockOptions"
        label="Select Stock"
        outlined
        dense
        @update:model-value="fetchStockPerformance"
      />
      <q-inner-loading :showing="loading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <LineChart v-if="!loading && chartData.labels.length" 
        :data="chartData" 
        :options="chartOptions" 
      />
      <div v-else-if="!loading" class="error-message">No stock data available</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from "vue";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import api from "../../api";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

export default defineComponent({
  components: { LineChart },
  setup() {
    const loading = ref(false);
    const selectedStock = ref(null);
    const stockOptions = ref(["AAPL", "TSLA", "AMZN", "MSFT", "GOOGL"]);
    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Stock Price ($)",
          data: [],
          borderColor: "#42A5F5",
          backgroundColor: "rgba(66, 165, 245, 0.2)",
          fill: true,
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "top" },
      },
    });

    const fetchStockPerformance = async () => {
      if (!selectedStock.value) return;

      loading.value = true;
      try {
        console.log(`📡 Fetching stock performance for ${selectedStock.value}...`);
        const response = await api.get(`/alpaca/stock-performance/${selectedStock.value}`);

        if (!response.data || !response.data.dates || !response.data.prices) {
          console.warn("⚠️ No stock performance data available.");
          chartData.value = { labels: [], datasets: [] };
        } else {
          await nextTick();
          chartData.value.labels = response.data.dates;
          chartData.value.datasets[0].data = response.data.prices;
        }
      } catch (error) {
        console.error("❌ Error fetching stock performance:", error);
        chartData.value = { labels: [], datasets: [] };
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      selectedStock.value = "AAPL"; // Default stock
      fetchStockPerformance();
    });

    return { selectedStock, stockOptions, chartData, chartOptions, fetchStockPerformance, loading };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 700px;
  margin: auto;
  padding: 1rem;
}

.chart-header {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.error-message {
  text-align: center;
  color: red;
  font-size: 1rem;
}
</style>
