<template>
  <div v-if="isAuthenticated">
    <div class="dashboard-layout">
      <nav class="sidebar">
        <ul>
          <li><router-link to="/income">Income</router-link></li>
          <li><router-link to="/analytics">Analytics</router-link></li>
        </ul>
      </nav>
      <div class="dashboard-content">
        <DashboardHeader :userData="userData" @sign-out="signOut" />
        <main class="dashboard-main">
          <p>Your financial overview:</p>
          <div v-if="userData">
            <p>Welcome, {{ userData.username }}!</p>
            <p>Your balance: {{ userData.balance }}</p>
          </div>
        </main>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Redirecting to login...</p>
  </div>
</template>

<script>
import api from '../api';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';

export default {
  name: 'DashboardPage',
  components: {
    DashboardHeader,
  },
  data() {
    return {
      isAuthenticated: false,
      userData: null,
      loading: true,
    };
  },
  async created() {
    const tokenFromUrl = this.$route.hash ? this.$route.hash.split('=')[1] : null;
    const token = tokenFromUrl || localStorage.getItem('token');
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
          console.warn('Invalid response, redirecting to login.');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error);
        this.$router.push('/login');
      } finally {
        this.loading = false;
      }
    } else {
      console.warn('No token found, redirecting to login.');
      this.loading = false;
      this.$router.push('/login');
    }
  },
  methods: {
    signOut() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #2a3f54;
  color: #fff;
  padding: 20px;
  height: 100vh; /* Make the sidebar stretch the full height */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar a {
  color: #fff;
  text-decoration: none;
}

.sidebar a:hover {
  text-decoration: underline;
}

.dashboard-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  flex: 0 0 auto;
}

.dashboard-main {
  flex-grow: 1;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>
