<template>
  <div v-if="isAuthenticated" :class="['dashboard-layout', isLightMode ? 'light-mode' : 'dark-mode']">
    <DashboardSidebar />
    <div class="dashboard-content">
      <DashboardHeader :userData="userData" :isLightMode="isLightMode" @sign-out="signOut" @toggle-theme="toggleTheme" />
      <main class="dashboard-main">
        <p>Your financial overview:</p>
        <div v-if="userData">
          <p>Welcome, {{ userData.username }}!</p>
          <p>Your balance: {{ userData.balance }}</p>
        </div>
      </main>
    </div>
  </div>
  <div v-else>
    <p>Redirecting to login...</p>
  </div>
</template>

<script>
import api from '../api';
import DashboardHeader from '../components/dashboard/DashboardHeader.vue';
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue';

export default {
  name: 'DashboardPage',
  components: {
    DashboardHeader,
    DashboardSidebar,
  },
  data() {
    return {
      isAuthenticated: false,
      userData: null,
      loading: true,
      isLightMode: false,
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
    toggleTheme() {
      this.isLightMode = !this.isLightMode;
    },
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  color: #ffffff;
  font-family: 'Arial, sans-serif';
  background-size: cover;
  background-position: center;
  filter: .2; 
}

.light-mode {
  background-image: url('/DBLightBG.png');
  background-size: cover;
  background-position: center;
  color: #000000;
}

.dark-mode {
  background-image: url('/DBDarkBG.png');
  background-size: cover;
  background-position: center;
  color: #ffffff;
}

.sidebar {
  width: 200px;
  background-color: #2a3f54;
  color: #fff;
  padding: 20px;
  height: 100vh; /* Make the sidebar stretch the full height */
}

.dashboard-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.dashboard-header {
  flex: 0 0 auto;
  background-color: rgba(51, 51, 51, 0.9);
  padding: 10px;
}

.dashboard-main {
  flex-grow: 1;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  overflow-y: auto;
}
</style>
