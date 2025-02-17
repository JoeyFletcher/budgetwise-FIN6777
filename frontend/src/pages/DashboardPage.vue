<template>
  <div v-if="isAuthenticated" :class="['dashboard-layout', isLightMode ? 'light-mode' : 'dark-mode']">
    <DashboardSidebar :userData="userData" @option-selected="updateMainContent" />
    <div class="dashboard-content">
      <DashboardHeader :userData="userData" :isLightMode="isLightMode" @sign-out="signOut" @toggle-theme="toggleTheme" />
      <main class="dashboard-main">
        <component :is="currentSectionComponent" />
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
import BudgetingSection from '../components/dashboard/sections/BudgetingSection.vue';
import LinkBankSection from '../components/dashboard/sections/LinkBankSection.vue';
import AccountSettingsSection from '../components/dashboard/sections/AccountSettingsSection.vue';
import AccountSummary from '../components/dashboard/sections/AccountSummary.vue';
import InvestmentsSection from '../components/dashboard/sections/InvestmentsSection.vue'; // ✅ Added Investments Section

export default {
  name: 'DashboardPage',
  components: {
    DashboardHeader,
    DashboardSidebar,
    BudgetingSection,
    LinkBankSection,
    AccountSettingsSection,
    AccountSummary,
    InvestmentsSection, // ✅ Registered Investments Section
  },
  data() {
    return {
      isAuthenticated: false,
      userData: null,
      loading: true,
      isLightMode: false,
      currentSection: 'accountSummary', // Default section
    };
  },
  computed: {
    currentSectionComponent() {
      switch (this.currentSection) {
        case 'budgeting':
          return 'BudgetingSection';
        case 'linkBank':
          return 'LinkBankSection';
        case 'accountSettings':
          return 'AccountSettingsSection';
        case 'investments': // ✅ Added case for investments
          return 'InvestmentsSection';
        case 'accountSummary':
        default:
          return 'AccountSummary';
      }
    },
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
    updateMainContent(section) {
      // ✅ Ensures sidebar can switch to investments
      this.currentSection = section;
    },
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column; /* Default to column for mobile view */
  min-height: 100vh;
  overflow: hidden;
  color: #ffffff;
  font-family: 'Arial, sans-serif';
  background-size: cover;
  background-position: center;
}

.light-mode {
  background-image: url('/DBLightBG_.png');
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

.dashboard-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.dashboard-header {
  flex: 0 0 auto;
  background-color: rgba(51, 51, 51, 0.9);
  padding: 1rem;
}

.dashboard-main {
  flex-grow: 1;
  padding: 1.25rem;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  overflow-y: auto;
}

/* Sidebar styles */
.sidebar {
  width: 15rem;
  background-color: #2a3f54;
  color: #fff;
  padding: 1.25rem;
  height: 100%; /* Adjust to fit viewport height */
}

/* Media Queries for Responsiveness */
@media (min-width: 768px) {
  .dashboard-layout {
    flex-direction: row; /* Change to row for larger screens */
  }

  .sidebar {
    width: 20%; /* Scale sidebar to 20% of the container on larger screens */
    min-width: 12rem; /* Minimum width to maintain usability */
  }

  .dashboard-content {
    flex-grow: 1;
    width: 80%; /* Remaining space for content */
  }
}

@media (max-width: 767px) {
  .sidebar {
    width: 100%;
    height: auto; /* Make sidebar fit content on smaller screens */
    padding: 0.625rem;
    order: -1; /* Move sidebar to the top on small screens */
  }

  .dashboard-main {
    padding: 0.625rem; /* Reduce padding for smaller screens */
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 0.3125rem;
  }

  .dashboard-main {
    padding: 0.3125rem;
  }
}
</style>
