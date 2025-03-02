<template>
  <section class="account-summary">
    <h1>Welcome to Your Dashboard</h1>
    <div class="tile-container">
      
      <!-- Transactions Tile -->
      <div class="tile transactions" @click="selectSection('transactions')">
        <i class="fas fa-exchange-alt"></i>
        <h2>Transactions</h2>
      </div>

      <!-- Budgeting Tile -->
      <div class="tile budgeting" @click="selectSection('budgeting')">
        <i class="fas fa-wallet"></i>
        <h2>Budgeting</h2>
      </div>

      <!-- Investments Tile -->
      <div class="tile investments" @click="selectSection('investments')">
        <i class="fas fa-chart-line"></i>
        <h2>Investments</h2>
      </div>

      <!-- Linked Accounts Tile -->
      <div class="tile link-accounts" @click="selectSection('linkBank')">
        <i class="fas fa-university"></i>
        <h2>Linked Accounts</h2>
      </div>

      <!-- Account Settings Tile -->
      <div class="tile account-settings" @click="selectSection('accountSettings')">
        <i class="fas fa-cog"></i>
        <h2>Account Settings</h2>
      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: 'AccountSummary',
  emits: ['option-selected'],
  setup(_, { emit }) {
    const selectSection = (section) => {
      console.log(`📌 Emitting event for section: ${section}`);
      emit('option-selected', section);
    };
    return { selectSection };
  }
};
</script>

<style scoped>
.account-summary {
  text-align: center;
  padding: 50px 5%;
}

.tile-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Ensures better spacing */
  gap: 30px; /* Increased spacing between tiles */
  margin-top: 30px;
  padding: 20px;
  justify-content: center;
  align-items: center;
}

/* Individual Tile Styling */
.tile {
  padding: 40px; /* Increased padding for better proportions */
  border-radius: 18px;
  text-align: center;
  cursor: pointer;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  position: relative;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Icons */
.tile i {
  font-size: 3rem; /* Slightly increased for better balance */
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.9);
}

/* Hover Effect */
.tile:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.35);
}

/* Tile Colors with Gradient */
.transactions { background: linear-gradient(135deg, #007bff, #0056b3); }
.budgeting { background: linear-gradient(135deg, #28a745, #1e7e34); }
.investments { background: linear-gradient(135deg, #fd7e14, #c05600); }
.link-accounts { background: linear-gradient(135deg, #6c757d, #4d5257); }
.account-settings { background: linear-gradient(135deg, #6f42c1, #4b2f91); }

h1 {
  font-size: 2.8rem;
  margin-bottom: 30px;
  color: #fff;
  text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.25);
}

h2 {
  margin: 0;
  font-size: 1.5rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .tile-container {
    grid-template-columns: repeat(2, minmax(250px, 1fr)); /* 2 columns on medium screens */
  }
}

@media (max-width: 768px) {
  .tile-container {
    grid-template-columns: 1fr; /* Stacks tiles on small screens */
  }
  .tile {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .tile {
    padding: 25px;
    font-size: 1.1rem;
  }
  .tile i {
    font-size: 2.4rem;
  }
}
</style>
