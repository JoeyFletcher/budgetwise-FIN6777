<template>
  <header class="dashboard-header">
    <div class="welcome-message-container">
      <h1 class="welcome-message">Welcome to your Budgetwise Dashboard, {{ userData ? userData.first_name : '' }}!</h1>
    </div>
    <div class="header-buttons">
      <label class="theme-toggle">
        <input type="checkbox" :checked="isDarkMode" @change="toggleSwitch" />
        <span class="slider">
          <span class="icon sun"><i class="fas fa-sun"></i></span>
          <span class="icon moon"><i class="fas fa-moon"></i></span>
        </span>
      </label>
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
  methods: {
    toggleSwitch() {
      this.$emit('toggle-theme');
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.dashboard-header {
  background-color: #333;
  color: #fff;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  position: relative;
}

.welcome-message-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-message {
  font-size: 1.8rem;
  margin: 0;
  text-align: center;
}

.header-buttons {
  display: flex;
  gap: 15px;
}

/* Toggle Switch */
.theme-toggle {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 40px;
}

.theme-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #87ceeb 0%, #f2f7f8 50%, #0e314c 100%);
  transition: 0.4s;
  border-radius: 50px;
  overflow: hidden;
}

.slider:before {
  position: absolute;
  content: "";
  height: 34px;
  width: 34px;
  left: 3px;
  bottom: 3px;
  background-color: #fff;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(90deg, #041326 0%, #0e314c 100%);
}

input:checked + .slider:before {
  transform: translateX(40px);
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #fff;
}

.sun {
  left: 8px;
}

.moon {
  right: 8px;
}

/* Button Styles */
.sign-out-button {
  background-color: #ff4444;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-out-button:hover {
  background-color: #cc0000;
}
</style>
