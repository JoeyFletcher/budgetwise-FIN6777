<template>
  <aside :class="['dashboard-sidebar', {collapsed: isCollapsed}]"
  @mouseover="isHovered = true"
  @mouseleave="isHovered = false">
    <button class="collapse-btn" @click="toggleSidebar">
      <i class="fas fa-arrow-right" v-if="isCollapsed"></i>
      <i class="fas fa-arrow-left" v-if="!isCollapsed"></i>
    </button>
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
          <i class="fas fa-wallet icon"></i>
          <span v-if="!isCollapsed || isHovered"> Account Summary </span>
        </li>
        <li @click="selectOption('budgeting')">
          <i class="fas fa-chart-line icon"></i> 
          <span v-if="!isCollapsed || isHovered"> Budgeting </span>
        </li>
        <li @click="selectOption('linkBank')">
          <i class="fas fa-university icon"></i> 
          <span v-if="!isCollapsed || isHovered"> Link Other Accounts </span>
        </li>
        <li @click="selectOption('accountSettings')">
          <i class="fas fa-user-cog icon"></i> 
          <span v-if="!isCollapsed || isHovered"> Account Settings </span>
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
      isCollapsed: false, // New data property to track sidebar state
      isHovered: false, // Track hover state for sidebar
      avatars: [
        'girl.png', 'man.png', 'profile 2.png', 'human.png', 'boy.png', 'woman.png', 'profile.png'
      ],
      selectedAvatar: '',
      showAvatarSelection: false,
      sidebarCollapsed: false, // Track whether the sidebar is collapsed
    };
  },
  created() {
    // Set a random avatar as the default one when the component is created
    this.selectedAvatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
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

.dashboard-sidebar.collapsed {
  max-width: 80px; /* Adjust this value to control collapsed width */
}

/* Handle the hover effect to show text when collapsed */
.dashboard-sidebar.collapsed:hover {
  max-width: 250px; /* Ensure the sidebar expands on hover */
}

.nav-section li span {
  display: none; /* Hide text by default */
}

/* Show text when sidebar is not collapsed or hovered */
.dashboard-sidebar .nav-section li span {
  display: inline-block;
}

/* Show text when the sidebar is collapsed and hovered */
.dashboard-sidebar.collapsed:hover .nav-section li span {
  display: inline-block;
}

.icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

/* Add media queries if necessary */
@media (max-width: 768px) {
  /* Hide text when sidebar is collapsed */
  .dashboard-sidebar .nav-section li span {
    display: none;
  }
  
  /* Show text when sidebar is collapsed and hovered */
  .dashboard-sidebar.collapsed:hover .nav-section li span {
    display: inline-block;
  }
}

.collapse-btn {
  position: absolute;
  top: 5px; /* Adjust top value to move the button lower or higher */
  right: 20px; /* Adjust left value to position it horizontally */
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000; /* Ensure the button appears above other elements */
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
  /* Hide text when sidebar is collapsed */
  .dashboard-sidebar .nav-section li span {
    display: none;
  }

  /* Adjust icon size for better visual balance */
  .icon {
    font-size: 1.5rem;
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
