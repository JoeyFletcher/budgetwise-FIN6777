<template>
  <header class="dashboard-header">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
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
  padding: 0.75rem 1.5rem; /* Reduced padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px; /* Reduced height */
  position: relative;
}

.logo-container {
  flex-shrink: 0;
}

.responsive-logo {
  max-width: 180px; /* Reduced logo size */
  height: auto;
}

/* Header Buttons */
.header-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
  position: absolute;
  right: 20px;
}

/* Toggle Switch */
.theme-toggle {
  position: relative;
  display: inline-block;
  width: 3.5rem;
  height: 1.5rem;
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
  height: 1.3rem;
  width: 1.3rem;
  left: 0.2rem;
  bottom: 0.1rem;
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
  font-size: 1rem;
  color: #fff;
}

.sun {
  left: 0.4rem;
}

.moon {
  right: 0.4rem;
}

/* Button Styles */
.sign-out-button {
  background-color: #a03acd;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.sign-out-button:hover {
  background-color: #2e177a;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .responsive-logo {
    max-width: 140px; /* Further reduced size on smaller screens */
  }

  .theme-toggle {
    width: 3rem;
    height: 1.2rem;
  }

  .slider:before {
    height: 1.1rem;
    width: 1.1rem;
    left: 0.1rem;
    bottom: 0.1rem;
  }

  input:checked + .slider:before {
    transform: translateX(1.5rem);
  }

  .sign-out-button {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    flex-direction: row;
    height: auto;
    padding: 0.5rem 1rem;
  }

  .header-buttons {
    gap: 0.5rem;
  }

  .sign-out-button {
    font-size: 0.75rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>
