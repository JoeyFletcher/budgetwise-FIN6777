<template>
  <div v-if="isAuthenticated">
    <h1>Dashboard</h1>
    <p>Your financial overview:</p>
    <div v-if="userData">
      <p>Welcome, {{ userData.username }}!</p>
      <p>Your balance: {{ userData.balance }}</p>
    </div>
  </div>
  <div v-else>
    <p>Redirecting to login...</p>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'DashboardPage',
  data() {
    return {
      isAuthenticated: false,
      userData: null,
    };
  },
  async created() {
    const token = localStorage.getItem('token');
    console.log('Dashboard created. Token:', token);
    
    if (token) {
      try {
        console.log('Attempting to fetch user data with token...');
        const response = await api.get('/user/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.status === 200) {
          console.log('User data fetched successfully:', response.data);
          this.isAuthenticated = true;
          this.userData = response.data;
        } else {
          console.warn('Invalid response, staying on dashboard for debugging.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error);
      }
    } else {
      console.warn('No token found, staying on dashboard for debugging.');
    }
  },
};
</script>
