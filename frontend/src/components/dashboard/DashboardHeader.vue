<template>
  <header class="dashboard-header">
    <h1 class="welcome-message">Welcome to your Budgetwise Dashboard, {{ userData ? userData.first_name : '' }}!</h1>
    <div class="header-buttons">
      <button @click="$emit('toggle-theme')" class="theme-toggle-button">
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
      <button @click="$emit('sign-out')" class="sign-out-button">Sign Out</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'DashboardHeader',
  props: {
    userData: {
      type: Object,
      required: true,
    },
    isDarkMode: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.dashboard-header {
  background-color: #333;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.welcome-message {
  font-size: 1.5rem;
  margin: 0;
  flex-grow: 1;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.theme-toggle-button,
.sign-out-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.theme-toggle-button {
  background-color: #007bff;
}

.theme-toggle-button:hover {
  background-color: #0056b3;
}

.sign-out-button {
  background-color: #ff4444;
}

.sign-out-button:hover {
  background-color: #cc0000;
}
</style>
