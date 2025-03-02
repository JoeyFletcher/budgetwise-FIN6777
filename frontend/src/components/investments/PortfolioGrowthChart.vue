<template>
  <div class="chart-container">
    <LineChart v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <div v-else class="loading-placeholder">📡 Loading portfolio data...</div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Line as LineChart } from "vue-chartjs";  // ✅ Renamed to LineChart
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from "chart.js";
import api from "../../api";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

export default defineComponent({
  components: { LineChart },  // ✅ Updated reference
  setup() {
    // Ensure chartData is initialized with an empty structure
    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Portfolio Value ($)",
          data: [],
          borderColor: "#42A5F5",
          backgroundColor: "rgba(66, 165, 245, 0.2)",
          fill: true
        }
      ]
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top"
        }
      }
    });

    const fetchPortfolioGrowth = async () => {
      try {
        console.log("📡 Fetching Portfolio Growth Data...");
        const response = await api.get("/alpaca/portfolio_growth");

        if (!response.data || !response.data.dates || !response.data.values) {
          console.error("❌ Unexpected API Response:", response.data);
          return;
        }

        chartData.value.labels = response.data.dates;
        chartData.value.datasets[0].data = response.data.values;

        console.log("✅ Portfolio Data Loaded:", chartData.value);
      } catch (error) {
        console.error("❌ Error fetching portfolio growth data:", error);
      }
    };

    onMounted(fetchPortfolioGrowth);

    return {
      chartData,
      chartOptions
    };
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-placeholder {
  font-size: 1.2rem;
  color: #bbb;
}
</style>
