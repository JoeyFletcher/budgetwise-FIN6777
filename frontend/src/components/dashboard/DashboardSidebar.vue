<template>
  <aside :class="['dashboard-sidebar', {collapsed: isCollapsed}]">
    <button class="collapse-btn" @click="toggleSidebar">
      <i class="fas fa-arrow-right" v-if="isCollapsed"></i>
      <i class="fas fa-arrow-left" v-if="!isCollapsed"></i>
    </button>
    <div class="avatar-section" v-if="!isCollapsed">
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
          <span v-if="!isCollapsed"> Account Summary </span>
        </li>
        <li @click="selectOption('linkBank')">
          <i class="fas fa-university icon"></i> 
          <span v-if="!isCollapsed"> Link Accounts </span>
        </li>
        <li @click="selectOption('transactions')">
          <i class="fas fa-exchange-alt icon"></i>
          <span v-if="!isCollapsed"> Transactions </span>
        </li>
        <li @click="selectOption('budgeting')">
          <i class="fas fa-chart-line icon"></i> 
          <span v-if="!isCollapsed"> Budgeting </span>
        </li>
        <li @click="selectOption('investments')">
          <i class="fas fa-chart-pie icon"></i>
          <span v-if="!isCollapsed"> Investments </span>
        </li>
        <li @click="selectOption('accountSettings')">
          <i class="fas fa-user-cog icon"></i> 
          <span v-if="!isCollapsed"> Account Settings </span>
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
      isCollapsed: false,
      avatars: [
        'girl.png', 'man.png', 'human.png', 'boy.png', 'woman.png', 'profile.png'
      ],
      selectedAvatar: '',
      showAvatarSelection: false,
    };
  },
  created() {
    this.selectedAvatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        this.showAvatarSelection = false;
      }
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
  height: 100vh;
  font-family: 'Arial, sans-serif';
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: auto;
}

.dashboard-sidebar.collapsed {
  max-width: 80px;
}

.collapse-btn {
  position: absolute;
  top: 5px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
}

.avatar-section {
  text-align: center;
  margin-top: 30px;
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
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatars-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.avatar-option {
  width: 35px;
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
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
}

.nav-section {
  width: 100%;
  margin-top: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1rem;
}

nav ul li {
  margin-bottom: 15px;
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  border-radius: 10px;
}

nav ul li:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}
</style>
