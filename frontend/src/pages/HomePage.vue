<template>
  <div class="home-container">
    <!-- Navigation Section (Login and Signup Links) -->
    <nav class="nav-section">
      <ul class="nav-links">
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/signup">Sign Up</router-link></li>
      </ul>
    </nav>

    <!-- Welcome Section -->
    <section class="welcome-section">
      <h1>Welcome to Budgetwise</h1>
      <p>Take control of your finances and achieve your goals with our intuitive personal finance dashboard.</p>
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
      <p>&copy; 2024 Budgetwise. All rights reserved.</p>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Navigation Section */
.nav-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
}

.nav-links li {
  display: inline;
}

.nav-links a {
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
}

.nav-links a:hover {
  text-decoration: underline;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  padding: 40px 20px;
  background-color: #f4f6f8;
  border-radius: 8px;
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  color: #333;
}

.welcome-section p {
  font-size: 1.2rem;
  color: #666;
  margin: 20px 0;
}

/* Features Section */
.features-section {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.feature-card {
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
}

/* Footer Section */
.footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.footer p {
  color: #999;
}
</style>
