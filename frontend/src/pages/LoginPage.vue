<template>
  <div class="login-container" style="background-image: url('/DBDarkBG.png');">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
    </div>
    <!-- Login Form Section -->
    <section class="login-section">
      <div class="login-content">
        <h1>Login</h1>
        <form class="login-form">
          <div class="form-field">
            <label for="usernameOrEmail">Username or Email:</label>
            <input type="text" id="usernameOrEmail" v-model="usernameOrEmail" />
            <span v-if="usernameOrEmailError" class="error-message">{{ usernameOrEmailError }}</span>
          </div>
          <div class="form-field">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" />
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>
          <LoadingSpinner v-if="loading" message="Logging in..." />
          <button type="button" @click="submitLogin" :disabled="loading">Login</button>
        </form>
        <p class="signup-link">Don't have an account? <router-link to="/signup">Sign up here</router-link>.</p>
        <p class="forgot-password-link"><router-link to="/forgot-password">Forgot your password?</router-link></p>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Budgetwise. Group 3 Project.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import api from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';

export default {
  name: 'LoginPage',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      usernameOrEmailError: '',
      passwordError: '',
      loading: false
    };
  },
  methods: {
    async submitLogin() {
      // Clear previous errors
      this.usernameOrEmailError = '';
      this.passwordError = '';

      console.log("Login attempt with: ", this.usernameOrEmail);

      // Basic frontend validation
      if (!this.usernameOrEmail) {
        console.log("No username or email provided");
        this.usernameOrEmailError = 'Username or email is required.';
        return;
      }

      if (!this.password) {
        console.log("No password provided");
        this.passwordError = 'Password is required.';
        return;
      }

      try {
        this.loading = true;
        console.log("Sending login request to backend...");
        // Send data to the backend for login using Axios instance
        const response = await api.post('/auth/login', {
          usernameOrEmail: this.usernameOrEmail,
          password: this.password
        });

        console.log('Login response:', response.data); // Log the response

        // Handle successful login
        if (response.data.success) {
          console.log('Successful login. Saving token and redirecting.');
          this.$router.push('twofactorlock'); //
        } else {
          // Handle login errors from the server
          console.error('Login error from server:', response.data.error);
          if (response.data.error.includes('Username or email')) {
            this.usernameOrEmailError = response.data.error;
          } else if (response.data.error.includes('Password')) {
            this.passwordError = response.data.error;
          } else {
            alert('Login failed: ' + response.data.error);
          }
        }
      } catch (error) {
        console.error('Error during login:', error);
        if (error.response) {
          console.error("Backend returned an error:", error.response.data);
          this.usernameOrEmailError = error.response.data.error || 'An error occurred. Please try again later.';
        } else {
          console.error("An unknown error occurred:", error);
          this.usernameOrEmailError = 'An unknown error occurred. Please try again later.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
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

/* General Container */
.login-container {
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Arial, sans-serif';
  background-size: cover;
  background-position: center;
  color: #ffffff;
  min-height: 100vh;
  height: 100%;
  background-attachment: fixed;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

/* Login Section */
.login-section {
  text-align: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  margin: auto;
  flex-grow: 1;
  margin-top: 5px;
}

.login-content h1 {
  font-size: 3rem;
  color: #a03acd;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  background-color: #a03acd;
  color: #ffffff;
  padding: 15px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  transition: background-color 0.3s, transform 0.3s;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

button:hover:not(:disabled) {
  background-color: #2e177a;
  transform: scale(1.05);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 5px;
}

.signup-link,
.forgot-password-link {
  margin-top: 25px;
  color: #00e5ff;
  font-size: 1.2rem;
}

.signup-link a,
.forgot-password-link a {
  color: #ff5722;
  text-decoration: none;
  font-weight: bold;
}

.signup-link a:hover,
.forgot-password-link a:hover {
  text-decoration: underline;
}

/* Footer Section */
.footer {
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: calc(100% - 40px);
  margin: 20px auto;
  flex-shrink: 0;
}

.footer p {
  color: #999;
}
</style>
