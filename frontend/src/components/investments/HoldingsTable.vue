<template>
  <q-card class="holdings-container">
    <q-card-section>
      <div class="holdings-header">Portfolio Holdings</div>
      <q-inner-loading :showing="loading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <q-table
        v-if="!loading && holdings.length > 0"
        :rows="holdings"
        :columns="columns"
        row-key="symbol"
        dense
        bordered
      />
      <div v-else-if="!loading" class="error-message">No holdings available</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import api from '../../api';

export default defineComponent({
  setup() {
    const loading = ref(true);
    const holdings = ref([]);

    const columns = [
      { name: 'symbol', label: 'Symbol', align: 'left', field: 'symbol' },
      { name: 'qty', label: 'Quantity', align: 'right', field: 'qty', format: val => val.toFixed(2) },
      { name: 'market_value', label: 'Market Value ($)', align: 'right', field: 'market_value', format: val => `$${val.toFixed(2)}` },
      { name: 'avg_entry_price', label: 'Entry Price ($)', align: 'right', field: 'avg_entry_price', format: val => `$${val.toFixed(2)}` },
      { name: 'current_price', label: 'Current Price ($)', align: 'right', field: 'current_price', format: val => `$${val.toFixed(2)}` },
      { name: 'unrealized_pl', label: 'Unrealized P/L ($)', align: 'right', field: 'unrealized_pl', format: val => `$${val.toFixed(2)}` },
      { name: 'unrealized_plpc', label: 'Unrealized %', align: 'right', field: 'unrealized_plpc', format: val => `${(val * 100).toFixed(2)}%` },
    ];

    const fetchHoldings = async () => {
      try {
        console.log('📡 Fetching holdings...');
        const response = await api.get('/alpaca/holdings');
        holdings.value = response.data;
      } catch (error) {
        console.error('❌ Error fetching holdings:', error);
        holdings.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchHoldings);

    return { holdings, columns, loading };
  }
});
</script>

<style scoped>
.holdings-container {
  width: 100%;
  padding: 1rem;
}
.holdings-header {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.error-message {
  text-align: center;
  color: red;
  font-size: 1rem;
}
</style>
