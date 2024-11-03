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
        <li @click="selectOption('spending')">
          <i class="fas fa-wallet icon"></i> Spending
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
  width: 250px;
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
  overflow: hidden; /* Prevent any overflow */
}

.avatar-section {
  text-align: center;
  margin-top: 50px; /* Increase this value to move the avatar further down */
  margin-bottom: 20px;
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
}

.avatar-selection {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #34495e;
  padding: 10px 20px; /* Adjust padding to make it more rectangular */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  width: 240px; /* Increase the width to accommodate more avatars */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatars-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Arrange avatars in 4 columns */
  gap: 10px;
  margin-top: 10px;
}

.avatar-option {
  width: 40px; /* Decreased avatar size to fit 4 in a row */
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.username {
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
}

.nav-section {
  width: 100%;
  margin-top: 50px; /* Space between avatar and nav links */
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
  font-size: 1.1rem;
}

nav ul li {
  margin-bottom: 20px;
  cursor: pointer;
  font-weight: bold;
  padding: 15px;
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
  margin-right: 15px;
  font-size: 1.3rem;
}
</style>
