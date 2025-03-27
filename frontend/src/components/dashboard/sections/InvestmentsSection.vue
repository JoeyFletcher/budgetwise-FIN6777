<template>
  <div class="investments-container">
    <q-tabs v-model="selectedTab" class="text-primary">
      <q-tab name="sweep" label="Sweep Investments" />
      <q-tab name="portfolio" label="Portfolio Growth" />
      <q-tab name="allocation" label="Asset Allocation" />
      <q-tab name="performance" label="Stock Performance" />
      <q-tab name="holdings" label="Holdings" />
      <q-tab name="history" label="Trade History" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="sweep">
        <SweepInvestments />
      </q-tab-panel>
      <q-tab-panel name="portfolio">
        <PortfolioGrowthChart />
      </q-tab-panel>
      <q-tab-panel name="allocation">
        <AssetAllocationChart />
      </q-tab-panel>
      <q-tab-panel name="performance">
        <StockPerformanceChart />
      </q-tab-panel>
      <q-tab-panel name="holdings">
        <HoldingsTable />
      </q-tab-panel>
      <q-tab-panel name="history">
        <TradeHistoryTable />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { QTabs, QTab, QTabPanels, QTabPanel } from 'quasar';
import SweepInvestments from '../../investments/SweepInvestments.vue';
import PortfolioGrowthChart from '../../investments/PortfolioGrowthChart.vue';
import AssetAllocationChart from '../../investments/AssetAllocationChart.vue';
import StockPerformanceChart from '../../investments/StockPerformanceChart.vue';
import HoldingsTable from '../../investments/HoldingsTable.vue';
import TradeHistoryTable from '../../investments/TradeHistoryTable.vue';

export default {
  components: {
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    SweepInvestments,
    PortfolioGrowthChart,
    AssetAllocationChart,
    StockPerformanceChart,
    HoldingsTable,
    TradeHistoryTable,
  },
  data() {
    return {
      selectedTab: 'portfolio',
    };
  },
};
</script>

<style scoped>
.investments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>
