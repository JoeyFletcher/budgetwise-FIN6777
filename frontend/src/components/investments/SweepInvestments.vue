<template>
  <div class="sweep-container">
    <h2>💸 Sweep Investments</h2>

    <!-- ✅ Checking Balance Display -->
    <div class="checking-info" v-if="checkingBalance !== null">
      <p><strong>Current Checking Balance:</strong> {{ formatCurrency(checkingBalance) }}</p>
    </div>

    <!-- Sweep Summary & Auto Calculation -->
    <div class="sweep-box">
      <div class="summary">
        <p><strong>Total Income:</strong> {{ formatCurrency(totalIncome) }}</p>
        <p><strong>Total Spent:</strong> {{ formatCurrency(totalSpent) }}</p>
        <p><strong>Total Budgeted:</strong> {{ formatCurrency(totalBudgeted) }}</p>
        <p>
          <strong>Remaining Funds:</strong>
          <span :class="remainingFunds >= 0 ? 'positive' : 'negative'">
            {{ formatCurrency(remainingFunds) }}
          </span>
        </p>
        <p>
          <strong>Estimated Post-Sweep Balance:</strong>
          {{ formatCurrency(postSweepBalance) }}
        </p>
      </div>

      <div class="sweep-rules">
        <label>
          Minimum Checking Balance ($):
          <input type="number" v-model.number="minCheckingBalance" />
        </label>

        <p>
          <strong>Sweep Amount:</strong>
          <span :class="sweepAmount > 0 ? 'positive' : 'negative'">
            {{ formatCurrency(sweepAmount) }}
          </span>
        </p>

        <p v-if="sweepAmount === 0" class="negative">
          ❌ No sweepable funds available after preserving {{ formatCurrency(minCheckingBalance) }}.
        </p>

        <button @click="executeSweep">💼 Execute Sweep</button>
      </div>
    </div>

    <!-- Sweep Result -->
    <div v-if="sweepResult" class="result">
      <h3>✅ Sweep Result:</h3>
      <p>{{ sweepResult }}</p>
    </div>

    <!-- Ticker Allocations -->
    <div class="portfolio-allocations">
      <h3>📊 Sweep Tickers</h3>
      <p>Enter tickers and percentages for sweep allocation. Total must equal 100%.</p>

      <div class="allocation-row" v-for="(item, index) in allocations" :key="index">
        <input v-model="item.ticker" placeholder="Ticker (e.g. AAPL)" />
        <input v-model.number="item.percent" type="number" min="0" max="100" />
        <span>%</span>
        <button @click="removeAllocation(index)">❌</button>
      </div>

      <button class="add-btn" @click="addAllocation">➕ Add Ticker</button>

      <p :class="allocationTotal === 100 ? 'valid' : 'invalid'">
        Total: {{ allocationTotal }}%
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api';

const budget = ref([]);
const checkingBalance = ref(null);

const minCheckingBalance = ref(1000);
const sweepResult = ref('');

const allocations = ref([
  { ticker: 'ETH/USD', percent: 50 },
  { ticker: 'BTC/USD', percent: 50 }
]);

// Load budget
const loadBudget = async () => {
  try {
    const { data } = await api.get('/budget');
    budget.value = data.budgets?.budget || [];
  } catch (error) {
    console.error('❌ Failed to load budget:', error);
  }
};

// Load checking balance
const fetchCheckingBalance = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('❌ Missing access token in localStorage!');
    return;
  }

  try {
    const res = await api.get('/plaid/accounts/list', {
      params: { access_token: token }
    });

    const checking = res.data.accounts.find(
      acc => acc.subtype === 'checking' || acc.type === 'depository'
    );

    checkingBalance.value = checking?.balances?.current || 0;
  } catch (err) {
    console.error('❌ Error fetching checking balance:', err);
  }
};

onMounted(() => {
  loadBudget();
  fetchCheckingBalance();
});

const totalIncome = computed(() =>
  budget.value.find(c => c.category === 'INCOME')?.spent || 0
);
const totalSpent = computed(() =>
  budget.value.filter(c => c.category !== 'INCOME').reduce((sum, c) => sum + c.spent, 0)
);
const totalBudgeted = computed(() =>
  budget.value.filter(c => c.category !== 'INCOME').reduce((sum, c) => sum + c.budgeted, 0)
);
const remainingFunds = computed(() => totalIncome.value - totalSpent.value);

const allocationTotal = computed(() =>
  allocations.value.reduce((sum, a) => sum + a.percent, 0)
);

const sweepAmount = computed(() => {
  if (checkingBalance.value === null) return 0;

  const buffer = minCheckingBalance.value;
  const safeToSweep = checkingBalance.value - buffer;
  const possibleSweep = Math.min(remainingFunds.value, safeToSweep);

  return possibleSweep > 0 ? possibleSweep : 0;
});

const postSweepBalance = computed(() => {
  if (checkingBalance.value === null) return null;
  return checkingBalance.value - sweepAmount.value;
});

const addAllocation = () => {
  allocations.value.push({ ticker: '', percent: 0 });
};

const removeAllocation = (index) => {
  allocations.value.splice(index, 1);
};

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  return `$${Number(val).toFixed(2)}`;
};

const executeSweep = async () => {
  if (sweepAmount.value <= 0) {
    sweepResult.value = `❌ No sweepable funds after preserving $${minCheckingBalance.value}.`;
    return;
  }

  if (allocationTotal.value !== 100) {
    sweepResult.value = `❌ Allocation percentages must total 100%. Currently: ${allocationTotal.value}%`;
    return;
  }

  if (allocations.value.some(a => !a.ticker.trim())) {
    sweepResult.value = `❌ All allocations must include a ticker symbol.`;
    return;
  }

  let log = `💰 Investing ${formatCurrency(sweepAmount.value)}:\n`;

  for (const a of allocations.value) {
    const notional = (a.percent / 100) * sweepAmount.value;
    const ticker = a.ticker.toUpperCase();

    try {
      await api.post('/alpaca/sweep-order', {
        symbol: ticker,
        notional: notional.toFixed(2)
      });

      log += `✅ Bought ${ticker}: ${formatCurrency(notional)}\n`;
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      log += `❌ Failed to buy ${ticker}: ${msg}\n`;
    }
  }

  sweepResult.value = log;
};
</script>

<style scoped>
.sweep-container {
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  max-width: 1000px;
  margin: auto;
  color: #222;
}

.sweep-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 1rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.summary {
  flex: 1 1 300px;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sweep-rules {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

button {
  padding: 10px;
  background-color: #007bff;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.add-btn {
  margin-top: 1rem;
  background-color: #28a745;
}

.add-btn:hover {
  background-color: #1e7e34;
}

.positive {
  color: #28a745;
  font-weight: bold;
}

.negative {
  color: #dc3545;
  font-weight: bold;
}

.result {
  margin-top: 2rem;
  background: #e9f7ef;
  border-left: 4px solid #28a745;
  padding: 1rem;
  border-radius: 8px;
  color: #155724;
  white-space: pre-line;
}

/* Allocation section */
.portfolio-allocations {
  margin-top: 2rem;
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.portfolio-allocations h3 {
  margin-bottom: 0.5rem;
}

.allocation-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.allocation-row input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex: 1 1 150px;
  min-width: 120px;
}

.allocation-row span {
  font-weight: bold;
}

.valid {
  color: #28a745;
  font-weight: bold;
}

.invalid {
  color: #dc3545;
  font-weight: bold;
}
</style>
