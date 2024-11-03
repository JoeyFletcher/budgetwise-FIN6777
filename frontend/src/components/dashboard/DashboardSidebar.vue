<template>
    <aside class="dashboard-sidebar">
      <nav>
        <ul>
          <li><router-link to="/dashboard/income">Income</router-link></li>
          <li><router-link to="/dashboard/analytics">Analytics</router-link></li>
          <!-- Add more links as necessary -->
        </ul>
      </nav>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'DashboardSidebar',
  };
  </script>
  
  <style scoped>
  .dashboard-sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    height: calc(100vh - 60px); /* Adjust to fit with the header */
  }
  
  nav ul {
    list-style: none;
    padding: 0;
  }
  
  nav ul li {
    margin-bottom: 15px;
  }
  
  nav ul li a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
  }
  
  nav ul li a:hover {
    text-decoration: underline;
  }
  </style>
  