<template>
  <header class="dashboard-header">
    <h1 class="welcome-message">Welcome to your Budgetwise Dashboard, {{ userData ? userData.first_name : '' }}!</h1>
    <button @click="$emit('sign-out')" class="sign-out-button">Sign Out</button>
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
  font-size: 1.5rem; /* Reduce the size of the welcome message */
  margin: 0;
  flex-grow: 1;
}

.sign-out-button {
  background-color: #ff4444;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-out-button:hover {
  background-color: #cc0000;
}
</style>
