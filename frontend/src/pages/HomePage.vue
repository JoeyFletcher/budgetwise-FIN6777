<template>
  <div class="home-container" style="background-image: url('/DBDarkBG.png');">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
    </div>
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="welcome-content">
        <div class="nav-buttons">
          <router-link to="/login" class="button-link">Login</router-link>
          <router-link to="/signup" class="button-link">Sign Up</router-link>
        </div>
      </div>
    </section>

    <!-- Feature Highlights Section -->
    <section class="features-section">
      <div class="feature-card">
        <h3>Budget Management</h3>
        <p>Set and track budgets to keep your spending in check.</p>
      </div>
      <div class="feature-card">
        <h3>Spending Insights</h3>
        <p>Get insights into your spending patterns and discover saving opportunities.</p>
      </div>
      <div class="feature-card">
        <h3>Goal Tracking</h3>
        <p>Set financial goals and watch your progress in real-time.</p>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
      <p>&copy; 2024 Budgetwise. Group 3 Project.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
/* General Container */
.home-container {
  width: 100%;
  min-height: 100vh; /* Ensures it doesn't shrink below full height */
  display: flex;
  flex-direction: column; /* Arranges elements vertically */
  justify-content: space-around; /* Distributes space evenly */
  align-items: center; /* Centers items horizontally */
  color: #ffffff;
  box-sizing: border-box;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  }

.logo-container {
  text-align: center;
  padding-top: 20px;
  width: 100%;
}

.responsive-logo {
  width: 100%; /* Adjusts based on screen width */
  max-width: 600px; /* Limits width on larger screens */
  height: auto;
}

/* Media Query for Smaller Screens */
@media (max-width: 768px) {
  .responsive-logo {
    max-width: 150px; /* Further reduced size on smaller screens */
  }
}

/* Navigation Buttons in Welcome Section */
.nav-buttons {
  display: inline-flex;
  gap: 50px;
  justify-content: center;
  margin-top: 20px;
}

.button-link {
  padding: 15px 40px;
  background-color: #a03acd;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  border-radius: 50px;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  font-size: 1.2rem;
}

.button-link:hover {
  background-color: #2e177a;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-5px);
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  padding: 50px 20px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: calc(100% - 40px);
  max-width: 1200px;
}

/* This is not needed as the Welcome to Budgetwise section was removed */
/* .welcome-content h1 {
  font-size: 4vw;
  color: #00e5ff;
  margin-bottom: 20px;
}

.welcome-content p {
  font-size: 1.5vw;
  color: #e0e0e0;
} */

/* Features Section */
.features-section {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  padding: 40px;
  width: calc(100% - 40px);
  max-width: 1200px;
  box-sizing: border-box;
}

.feature-card {
  flex: 1;
  min-width: 280px;
  max-width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.575);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}

.feature-card h3 {
  font-size: 2rem;
  color: #a03acd;
  margin-bottom: 15px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.feature-card p {
  color: #080734;
  font-size: 1.2rem;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

/* Footer Section */
.footer {
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: calc(100% - 40px);
  max-width: 1200px;
  margin: 20px auto;
}

.footer p {
  color: #999;
}
</style>
