<template>
    <label class="theme-toggle">
      <input type="checkbox" :checked="localDarkMode" @change="toggleTheme" />
      <div class="slider">
        <div class="icon">
          <i :class="localDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
        </div>
      </div>
    </label>
  </template>
  
  <script>
  export default {
    name: 'ThemeToggle',
    props: {
      isDarkMode: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        localDarkMode: this.isDarkMode,
      };
    },
    methods: {
      toggleTheme() {
        this.localDarkMode = !this.localDarkMode;
        this.$emit('toggle-theme', this.localDarkMode);
      },
    },
  };
  </script>
  
  <style scoped>
  .theme-toggle {
    position: relative;
    display: inline-block;
    width: 70px;
    height: 30px;
    cursor: pointer;
  }
  
  .theme-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 30px;
    transition: 0.4s;
  }
  
  input:checked + .slider {
    background-color: #2196f3;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
  
  input:checked + .slider:before {
    transform: translateX(40px);
  }
  
  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 1rem;
  }
  </style>
  