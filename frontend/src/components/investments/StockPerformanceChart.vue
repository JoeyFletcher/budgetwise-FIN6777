<template>
  <div class="portfolio-container">
    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="error = null" class="dismiss-btn">×</button>
    </div>

    <div class="portfolio-content">
      <!-- Chart Section -->
      <div class="chart-section">
        <div class="chart-container">
          <h3>Portfolio Distribution by Current Values</h3>
          <div v-if="hasChartData" class="chart-wrapper">
            <canvas ref="donutChart"></canvas>
            <div class="chart-legend">
              <div v-for="(item, index) in chartData" :key="index" class="legend-item">
                <span class="legend-color" :style="{ backgroundColor: item.backgroundColor }"></span>
                <span class="legend-label">{{ item.label }} ({{ item.percent }}%)</span>
              </div>
            </div>
          </div>
          <div v-else class="no-data-message">
            Fetch market values to see portfolio distribution
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-section">
        <div class="last-fetch" v-if="lastFetchTime">
          Last updated: {{ formatDateTime(lastFetchTime) }}
        </div>
        <table class="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Market Value ($)</th>
              <th>Entry ($)</th>
              <th>Current ($)</th>
              <th>Unrealized P/L ($)</th>
              <th>Unrealized %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stock, index) in stocks" :key="index">
              <td>
                <input
                  v-if="stock.editing"
                  v-model="stock.symbol"
                  class="edit-input"
                  :class="{ 'input-error': !stock.symbol }"
                >
                <span v-else @click="startEdit(stock)">{{ stock.symbol }}</span>
              </td>
              <td>
                <input
                  v-if="stock.editing"
                  v-model.number="stock.quantity"
                  type="number"
                  min="1"
                  class="edit-input"
                  :class="{ 'input-error': stock.quantity <= 0 }"
                >
                <span v-else @click="startEdit(stock)">{{ addThousandsSeparator(stock.quantity, false) }}</span>
              </td>
              <td>{{ formatNullable(stock.marketValue) }}</td>
              <td>
                <input
                  v-if="stock.editing"
                  v-model.number="stock.entry"
                  type="number"
                  step="0.01"
                  min="0"
                  @keyup.enter="saveEdit(stock)"
                  class="edit-input"
                  :class="{ 'input-error': stock.entry < 0 }"
                >
                <span v-else @click="startEdit(stock)">{{ formatCurrency(stock.entry) }}</span>
              </td>
              <td>{{ formatNullable(stock.current) }}</td>
              <td :class="getPLClass(stock)">
                {{ formatNullable(calculateUnrealizedPL(stock)) }}
              </td>
              <td :class="getPercentClass(stock)">
                {{ formatPercent(calculateUnrealizedPercent(stock)) }}
              </td>
              <td>
                <div v-if="stock.editing" class="action-buttons">
                  <button @click="removeStock(index)" class="action-btn remove-btn">×</button>
                  <button
                    @click="saveEdit(stock)"
                    class="action-btn save-btn"
                    :disabled="!isStockValid(stock)"
                  >
                    Save
                  </button>
                </div>
                <div v-else class="action-buttons">
                  <button @click="removeStock(index)" class="action-btn remove-btn">×</button>
                  <button
                    @click="startEdit(stock)"
                    class="action-btn edit-btn"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
            <tr class="totals-row">
              <td colspan="3">TOTALS</td>
              <td>{{ formatCurrency(totals.entry) }}</td>
              <td>{{ formatNullable(totals.current) }}</td>
              <td :class="getTotalsPLClass()">
                {{ formatNullable(totals.unrealizedPL) }}
              </td>
              <td :class="getTotalsPercentClass()">
                {{ formatPercent(totals.unrealizedPercent) }}
              </td>
              <td>
                <button @click="addNewStock" class="action-btn add-btn">+ Add Stock</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="controls">
          <button @click="fetchMarketValues" :disabled="isLoading" class="fetch-button">
            {{ isLoading ? 'Fetching...' : 'Fetch Market Values' }}
          </button>
          <button @click="resetToDefaults" class="reset-btn">
            Reset to Remote
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const STORAGE_KEY = 'stockPortfolio';
const VERSION = 1;

export default {
  name: 'StockPortfolioTracker',
  data() {
    return {
      stocks: [],
      isLoading: false,
      hasFetchedData: false,
      error: null,
      donutChart: null,
      lastFetchTime: null,
      chartColors: [
        '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
        '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
        '#9c755f', '#bab0ac'
      ]
    };
  },
  computed: {
    totals() {
      const totalEntry = this.stocks.reduce((sum, stock) => sum + (stock.quantity * stock.entry), 0);
      const validStocks = this.stocks.filter(stock => stock.current !== null);
      const totalCurrent = validStocks.reduce((sum, stock) => sum + stock.current, 0);
      const totalUnrealizedPL = validStocks.length ? totalCurrent - totalEntry : null;
      const totalUnrealizedPercent = totalUnrealizedPL !== null && totalEntry !== 0 ?
        (totalUnrealizedPL / totalEntry) * 100 :
        null;

      return {
        entry: totalEntry,
        current: validStocks.length ? totalCurrent : null,
        unrealizedPL: totalUnrealizedPL,
        unrealizedPercent: totalUnrealizedPercent
      };
    },
    hasChartData() {
      return this.stocks.some(stock => stock.current !== null && stock.current > 0);
    },
    chartData() {
      if (!this.hasChartData) return [];

      const total = this.stocks.reduce((sum, stock) => sum + (stock.current || 0), 0);

      return this.stocks
        .filter(stock => stock.current > 0)
        .map((stock, index) => {
          const value = stock.current || 0;
          return {
            label: stock.symbol,
            value: value,
            percent: ((value / total) * 100).toFixed(1),
            backgroundColor: this.chartColors[index % this.chartColors.length],
            borderColor: '#fff'
          };
        });
    }
  },
  methods: {
    // Date/Time Formatting
    formatDateTime(date) {
      if (!date) return 'Never';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      return new Date(date).toLocaleString(undefined, options);
    },

    // Number Formatting
    addThousandsSeparator(num, includeDecimals = true) {
      if (num === null || isNaN(num)) return 'N/A';

      const numStr = typeof num === 'number' ? num.toString() : num;
      const parts = numStr.split('.');
      let wholePart = parts[0];
      const decimalPart = parts.length > 1 ? parts[1] : '';

      wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (includeDecimals) {
        const formattedDecimal = decimalPart.length > 0
          ? '.' + (decimalPart.length > 2 ? decimalPart.substring(0, 2) : decimalPart)
          : '.00';
        return wholePart + formattedDecimal;
      }
      return wholePart;
    },

    formatCurrency(value) {
      if (value === null || isNaN(value)) return 'N/A';
      return '$' + this.addThousandsSeparator(value.toFixed(2));
    },

    formatNullable(value) {
      return value === null ? 'N/A' : '$' + this.addThousandsSeparator(value.toFixed(2));
    },

    formatPercent(value) {
      return value === null ? 'N/A' : value.toFixed(2) + '%';
    },

    // Data Persistence
    loadStocks() {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.version !== VERSION) throw new Error('Data format outdated');

          this.stocks = parsed.stocks.map(stock => ({
            ...stock,
            editing: false
          }));

          this.hasFetchedData = this.stocks.some(stock => stock.marketValue !== null);
          this.lastFetchTime = parsed.lastFetchTime || null;
        } else {
          this.initializeDefaultStocks();
        }
      } catch (err) {
        console.error('Failed to load stocks:', err);
        this.showError('Failed to load saved data. Using defaults.');
        this.initializeDefaultStocks();
      }
    },

    saveStocks() {
      try {
        const dataToSave = {
          version: VERSION,
          lastUpdated: new Date().toISOString(),
          lastFetchTime: this.lastFetchTime,
          stocks: this.stocks.map(stock => ({
            symbol: stock.symbol,
            quantity: stock.quantity,
            entry: stock.entry,
            marketValue: stock.marketValue,
            current: stock.current
          }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (err) {
        console.error('Failed to save stocks:', err);
        this.showError('Failed to save changes to browser storage.');
      }
    },

    // Chart Methods
    updateChart() {
      if (this.donutChart) {
        this.donutChart.destroy();
        this.donutChart = null;
      }

      if (!this.hasChartData) {
        return;
      }

      const ctx = this.$refs.donutChart?.getContext('2d');
      if (!ctx) return;

      const data = {
        labels: this.chartData.map(item => item.label),
        datasets: [{
          data: this.chartData.map(item => item.value),
          backgroundColor: this.chartData.map(item => item.backgroundColor),
          borderColor: this.chartData.map(item => item.borderColor),
          borderWidth: 2
        }]
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const percent = this.chartData.find(item => item.label === label)?.percent || '0';
                return `${label}: ${this.formatCurrency(value)} (${percent}%)`;
              }
            }
          }
        },
        cutout: '70%'
      };

      this.donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
      });
    },

    // Stock Management
    initializeDefaultStocks() {
      this.stocks = [
        { symbol: 'AAPL', quantity: 10, entry: 200.45, marketValue: null, current: null, editing: false },
        { symbol: 'TSLA', quantity: 15, entry: 350.23, marketValue: null, current: null, editing: false },
        { symbol: 'AMZN', quantity: 20, entry: 153.23, marketValue: null, current: null, editing: false },
        { symbol: 'MSFT', quantity: 30, entry: 330.54, marketValue: null, current: null, editing: false },
        { symbol: 'GOOGL', quantity: 50, entry: 160.55, marketValue: null, current: null, editing: false }
      ];
      this.hasFetchedData = false;
      this.lastFetchTime = null;
      this.saveStocks();
    },

    resetToDefaults() {
      if (confirm('Reset all stocks to defaults? This cannot be undone.')) {
        if (this.donutChart) {
          this.donutChart.destroy();
          this.donutChart = null;
        }

        this.initializeDefaultStocks();

        this.$nextTick(() => {
          this.updateChart();
        });
      }
    },

    startEdit(stock) {
      this.stocks.forEach(s => s.editing = false);
      stock.editing = true;
    },

    isStockValid(stock) {
      return stock.symbol.trim() && stock.quantity > 0 && stock.entry >= 0;
    },

    saveEdit(stock) {
      if (!this.isStockValid(stock)) {
        this.showError('Please enter valid values for all fields');
        return;
      }

      stock.editing = false;
      stock.symbol = stock.symbol.trim().toUpperCase();

      if (stock.marketValue !== null) {
        stock.current = this.calculateCurrentValue(stock);
      }

      this.saveStocks();
      this.updateChart();
    },

    addNewStock() {
      this.stocks.push({
        symbol: '',
        quantity: 1,
        entry: 0,
        marketValue: null,
        current: null,
        editing: true
      });
      this.$nextTick(() => {
        const lastRow = this.$el.querySelector('tbody tr:last-child td:first-child input');
        if (lastRow) lastRow.focus();
      });
    },

    removeStock(index) {
      if (confirm('Remove this stock from your portfolio?')) {
        this.stocks.splice(index, 1);
        this.saveStocks();
        this.updateChart();
      }
    },

    // Data Fetching
    async fetchMarketValues() {
      if (this.stocks.length === 0) {
        this.showError('No stocks to fetch');
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const results = await Promise.all(
          this.stocks.map(async stock => {
            try {
              const response = await fetch(
                `http://localhost:3001/api/rapid/stock-quote?ticker=${stock.symbol}`
              );

              if (!response.ok) throw new Error(`HTTP ${response.status}`);

              const data = await response.json();
              const priceStr = data.body?.primaryData?.lastSalePrice;
              const price = this.parsePrice(priceStr);

              if (price === null) throw new Error('Invalid price data');

              return { symbol: stock.symbol, price };
            } catch (err) {
              console.error(`Failed to fetch ${stock.symbol}:`, err);
              return { symbol: stock.symbol, price: null, error: err.message };
            }
          })
        );

        this.stocks = this.stocks.map(stock => {
          const result = results.find(r => r.symbol === stock.symbol);
          return {
            ...stock,
            marketValue: result?.price || null,
            current: result?.price ? stock.quantity * result.price : null,
            editing: false
          };
        });

        this.hasFetchedData = this.stocks.some(stock => stock.marketValue !== null);
        this.lastFetchTime = new Date();
        this.saveStocks();

        this.$nextTick(() => {
          this.updateChart();
        });

        const successCount = results.filter(r => r.price !== null).length;
        if (successCount < this.stocks.length) {
          this.showError(`Fetched ${successCount} of ${this.stocks.length} stocks. Some may be missing data.`);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        this.showError('Failed to fetch market data. Please try again.');
      } finally {
        this.isLoading = false;
      }
    },

    // Helper Methods
    parsePrice(priceString) {
      if (!priceString) return null;
      const price = parseFloat(priceString.replace(/[^0-9.-]/g, ''));
      return isNaN(price) ? null : price;
    },

    calculateCurrentValue(stock) {
      return stock.marketValue !== null ? stock.quantity * stock.marketValue : null;
    },

    calculateUnrealizedPL(stock) {
      return stock.current !== null ? stock.current - (stock.quantity * stock.entry) : null;
    },

    calculateUnrealizedPercent(stock) {
      const entry = stock.quantity * stock.entry;
      const pl = this.calculateUnrealizedPL(stock);
      return pl !== null && entry ? (pl / entry) * 100 : null;
    },

    getPLClass(stock) {
      const pl = this.calculateUnrealizedPL(stock);
      if (pl === null) return {};
      return {
        positive: pl > 0,
        negative: pl < 0
      };
    },

    getPercentClass(stock) {
      const percent = this.calculateUnrealizedPercent(stock);
      if (percent === null) return {};
      return {
        positive: percent > 0,
        negative: percent < 0
      };
    },

    getTotalsPLClass() {
      if (this.totals.unrealizedPL === null) return {};
      return this.totals.unrealizedPL >= 0 ? 'positive' : 'negative';
    },

    getTotalsPercentClass() {
      if (this.totals.unrealizedPercent === null) return {};
      return this.totals.unrealizedPercent >= 0 ? 'positive' : 'negative';
    },

    showError(message) {
      this.error = message;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    }
  },
  mounted() {
    this.loadStocks();
    this.$nextTick(() => {
      this.updateChart();
    });
  },
  beforeUnmount() {
    if (this.donutChart) {
      this.donutChart.destroy();
    }
  }
};
</script>

<style scoped>
/* --- Base & Layout --- */
.portfolio-container {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  box-sizing: border-box;
}

.portfolio-content {
  display: flex;
  gap: 30px;
}

.chart-section {
  flex: 1;
  min-width: 350px;
}

.table-section {
  flex: 2;
  min-width: 0;
}

/* --- Error Message --- */
.error-message {
  background-color: #fdecea;
  color: #b71c1c;
  padding: 12px 18px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f5c6cb;
}

.dismiss-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0 0 0 15px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.dismiss-btn:hover {
  opacity: 1;
}

/* --- Chart --- */
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  height: 100%;
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #343a40;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.no-data-message {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-style: italic;
}

/* --- Chart Legend --- */
.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
  margin-top: 25px;
  justify-content: center;
  padding: 0 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 6px;
  flex-shrink: 0;
}

.legend-label {
  white-space: nowrap;
  color: #495057;
}

/* --- Last Updated Timestamp --- */
.last-fetch {
  text-align: right;
  margin-bottom: 10px;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

/* --- Table Styling --- */
.stock-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.9rem;
}

.stock-table th, .stock-table td {
  padding: 12px 15px;
  text-align: right;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
  color: #212529;
}

.stock-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.stock-table th:first-child,
.stock-table td:first-child {
  text-align: left;
}
.stock-table td:first-child {
  font-weight: 500;
}

.stock-table tbody tr:nth-child(odd) {
  background-color: #fdfdfe;
}

.stock-table tbody tr:hover {
  background-color: #f1f3f5;
}

.stock-table tbody tr:last-child td {
  border-bottom: none;
}

.positive {
  color: #28a745 !important;
  font-weight: 500;
}

.negative {
  color: #dc3545 !important;
  font-weight: 500;
}

.totals-row {
  font-weight: bold;
  background-color: #f8f9fa;
}
.totals-row td {
  color: #343a40;
  border-top: 2px solid #dee2e6;
  border-bottom: none;
}
.totals-row td:first-child {
  text-align: left;
}

/* --- Controls / Main Buttons --- */
.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-start;
}

.fetch-button {
  padding: 12px 25px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fetch-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  box-shadow: none;
}

.fetch-button:not(:disabled):hover {
  background-color: #138496;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* --- Reset Button --- */
.reset-btn {
  padding: 12px 25px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reset-btn:hover {
  background-color: #5a6268;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* --- Edit Input --- */
.edit-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: inherit;
  font-family: inherit;
  text-align: right;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #212529;
}
.edit-input:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
td:first-child .edit-input {
  text-align: left;
}

.input-error {
  border-color: #dc3545;
  background-color: #fdecea;
}
.input-error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* --- Action Buttons Container --- */
.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  align-items: center;
}

/* --- Action Buttons --- */
.action-btn {
  padding: 6px 10px;
  margin: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
  vertical-align: middle;
  line-height: 1.2;
}
.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.edit-btn {
  background-color: #007bff;
  color: white;
}
.edit-btn:hover { background-color: #0056b3; }

.save-btn {
  background-color: #28a745;
  color: white;
}
.save-btn:hover { background-color: #218838; }

.remove-btn {
  background-color: #dc3545;
  color: white;
}
.remove-btn:hover { background-color: #c82333; }

.add-btn {
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  font-size: 0.9rem;
}
.add-btn:hover { background-color: #218838; }

/* --- Clickable Span --- */
.stock-table td span {
  color: inherit;
}
span[clickable] {
  cursor: pointer;
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
  display: inline-block;
  min-height: 1.2em;
  border-bottom: 1px dashed transparent;
}
span[clickable]:hover {
  color: #0056b3;
  border-bottom-color: #0056b3;
}

/* --- Responsive --- */
@media (max-width: 1200px) {
  .portfolio-content {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .portfolio-container {
    padding: 15px;
  }
  .chart-container, .stock-table td, .stock-table th {
    padding: 10px;
  }
  .fetch-button, .reset-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  .chart-wrapper {
    height: 250px;
  }
}
</style>