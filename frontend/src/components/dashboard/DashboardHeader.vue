<template>
  <header class="dashboard-header">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
    </div>
    <!-- Welcome Message-->
    <div class="welcome-message-container">
      <h1 class="welcome-message">Welcome to your Budgetwise Dashboard, {{ userData ? userData.first_name : '' }}!</h1>
    </div>
    <!-- Header Buttons (Theme Toggle and Sign Out) -->
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
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: auto;
  flex-wrap: wrap;
  position: relative;
}

.logo-container {
  flex-shrink: 0;
  left: 20px;
  top: 5px;
}

.responsive-logo {
  max-width: 400px;
  height: auto;
}

.welcome-message-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.welcome-message {
  font-size: 4vw; /* Font size relative to viewport width */
  margin: 0;
  text-align: center;
  max-width: 100%;
  line-height: 1.2; /* Adjusts line height for better readability */
}

/* Header Buttons */
.header-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;  /* Align to the right */
  align-items: flex-start;    /* Align to the top */
  position: absolute;
  right: 20px;
  top:20px;
  margin-bottom: 1rem;
}

/* Toggle Switch */
.theme-toggle {
  position: relative;
  display: inline-block;
  width: 4rem;
  height: 2rem;
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
  height: 1.7rem;
  width: 1.7rem;
  left: 0.2rem;
  bottom: 0.15rem;
  background-color: #fff;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(90deg, #041326 0%, #0e314c 100%);
}

input:checked + .slider:before {
  transform: translateX(2rem);
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #fff;
}

.sun {
  left: 0.5rem;
}

.moon {
  right: 0.5rem;
}

/* Button Styles */
.sign-out-button {
  background-color: #a03acd;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-out-button:hover {
  background-color: #2e177a;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .responsive-logo {
    max-width: 150px; /* Further reduced size on smaller screens */
  }

  .welcome-message {
    font-size: 1.2rem;
  }

  .theme-toggle {
    width: 3rem;
    height: 1.5rem;
  }

  .slider:before {
    height: 1.4rem;
    width: 1.4rem;
    left: 0.1rem;
    bottom: 0.1rem;
  }

  input:checked + .slider:before {
    transform: translateX(1.5rem);
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    flex-direction: column;
    padding: 1rem;
  }

  .header-buttons {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .sign-out-button {
    width: 100%;
    padding: 0.5rem;
  }
}
</style>
