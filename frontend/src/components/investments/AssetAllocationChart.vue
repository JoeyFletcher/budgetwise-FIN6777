<template>
  <div class="chart-container">
    <DoughnutChart
      v-if="chartData.labels.length"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="loading-placeholder">📡 Loading asset allocation data...</div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Doughnut as DoughnutChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import api from "../../api";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  components: { DoughnutChart },
  setup() {
    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Asset Allocation",
          data: [],
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false, // Ensures better fit
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    });

    const fetchAssetAllocation = async () => {
      try {
        console.log("📡 Fetching Asset Allocation Data...");
        const response = await api.get("/alpaca/asset-allocation");

        if (!response.data || !response.data.labels || !response.data.values) {
          console.error("❌ Unexpected API Response:", response.data);
          return;
        }

        chartData.value.labels = response.data.labels;
        chartData.value.datasets[0].data = response.data.values;

        console.log("✅ Asset Allocation Data Loaded:", chartData.value);
      } catch (error) {
        console.error("❌ Error fetching asset allocation:", error);
      }
    };

    onMounted(fetchAssetAllocation);

    return {
      chartData,
      chartOptions,
    };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px; /* Adjusted for better fit */
  max-width: 700px; /* Prevents excessive width */
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-placeholder {
  font-size: 1.2rem;
  color: #bbb;
  text-align: center;
}

/* Ensure investments section takes up more space */
.investments-section {
  width: 95%;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
