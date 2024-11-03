<template>
  <aside class="dashboard-sidebar">
    <div class="avatar-section">
      <img :src="`/avatars/${selectedAvatar}`" alt="User Avatar" class="avatar" @click="toggleAvatarSelection" />
      <div v-if="showAvatarSelection" class="avatar-selection">
        <div class="avatars-list">
          <img 
            v-for="avatar in avatars" 
            :key="avatar" 
            :src="`/avatars/${avatar}`" 
            :alt="avatar" 
            class="avatar-option" 
            @click="selectAvatar(avatar)" 
          />
        </div>
      </div>
      <p class="username">{{ userData?.username || 'User' }}</p>
    </div>
    <nav class="nav-section">
      <ul>
        <li @click="selectOption('accountSummary')">
          <i class="fas fa-wallet icon"></i> Account Summary
        </li>
        <li @click="selectOption('budgeting')">
          <i class="fas fa-chart-line icon"></i> Budgeting
        </li>
        <li @click="selectOption('linkBank')">
          <i class="fas fa-university icon"></i> Link Your Bank
        </li>
        <li @click="selectOption('accountSettings')">
          <i class="fas fa-user-cog icon"></i> Account Settings
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'DashboardSidebar',
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      avatars: [
        'girl.png', 'man.png', 'profile 2.png', 'human.png', 'boy.png', 'woman.png', 'profile.png'
      ],
      selectedAvatar: '',
      showAvatarSelection: false,
    };
  },
  created() {
    // Set a random avatar as the default one when the component is created
    this.selectedAvatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
  },
  methods: {
    toggleAvatarSelection() {
      this.showAvatarSelection = !this.showAvatarSelection;
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
      this.showAvatarSelection = false;
      localStorage.setItem('selectedAvatar', avatar);
    },
    selectOption(option) {
      // Emit an event with the selected option
      this.$emit('option-selected', option);
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.dashboard-sidebar {
  width: 100%;
  max-width: 250px;
  background-color: #2c3e50;
  color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  height: 100vh; /* Set to full height */
  font-family: 'Arial, sans-serif';
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: auto; /* Allow vertical scrolling for small screens */
}

.avatar-section {
  text-align: center;
  margin-top: 30px; /* Reduce margin for better fit on smaller screens */
  margin-bottom: 20px;
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
}

.avatar-selection {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #34495e;
  padding: 10px 15px; /* Adjust padding to make it more compact */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  width: 200px; /* Adjust width to fit smaller screens */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatars-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Arrange avatars in 3 columns for better responsiveness */
  gap: 10px;
  margin-top: 10px;
}

.avatar-option {
  width: 35px; /* Adjust avatar size for smaller screens */
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.username {
  margin-top: 10px;
  font-size: 1.2rem; /* Reduce font size for better fit on smaller screens */
  font-weight: bold;
  color: #ffffff;
}

.nav-section {
  width: 100%;
  margin-top: 30px; /* Reduce space between avatar and nav links for smaller screens */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align items upwards for better centering */
  align-items: flex-start;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0; /* Remove default margin */
  font-size: 1rem;
}

nav ul li {
  margin-bottom: 15px;
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-radius: 10px; /* Round corners for buttons */
}

nav ul li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  transform: translateX(5px);
}

.icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .dashboard-sidebar {
    width: 100%;
    max-width: none;
    height: auto;
    position: relative;
  }

  .avatar {
    width: 70px;
    height: 70px;
  }

  .nav-section {
    align-items: center;
  }

  nav ul li {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .avatar-section {
    margin-top: 20px;
  }

  .username {
    font-size: 1rem;
  }

  nav ul li {
    padding: 8px;
    margin-bottom: 10px;
  }
}
</style>
