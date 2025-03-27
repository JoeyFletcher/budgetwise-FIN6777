<template>
  <div class="signup-container" style="background-image: url('/DBDarkBG.png');">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
    </div>
    <!-- Signup Form Section -->
    <section class="signup-section">
      <div class="signup-content">
        <h1>Sign Up</h1>
        <form class="signup-form" @submit.prevent="submitSignup">
          <div class="form-field">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" />
            <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
          </div>
          <div class="form-field">
            <label for="email">Email Address:</label>
            <input type="email" id="email" v-model="email" />
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>
          <div class="form-field">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" v-model="firstName" />
            <span v-if="firstNameError" class="error-message">{{ firstNameError }}</span>
          </div>
          <div class="form-field">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" v-model="lastName" />
            <span v-if="lastNameError" class="error-message">{{ lastNameError }}</span>
          </div>
          <div class="form-field">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" />
          </div>
          <div class="form-field">
            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" />
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>
          <LoadingSpinner v-if="loading" message="Signing up..." />
          <button type="submit" :disabled="loading">Sign Up</button>
        </form>
        <p class="login-link">Already have an account? <router-link to="/login">Login here</router-link>.</p>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
      <p>&copy; 2024 Budgetwise. Group 3 Project.</p>
    </footer>
  </div>
</template>

<script>
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import api from '../api';

export default {
  name: 'SignupPage',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      firstNameError: '',
      lastNameError: '',
      loading: false,
    };
  },
  methods: {
    async submitSignup() {
      // Clear previous errors
      this.usernameError = '';
      this.emailError = '';
      this.passwordError = '';
      this.firstNameError = '';
      this.lastNameError = '';

      // Basic frontend validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const namePattern = /^[a-zA-Z]+$/;

      if (!this.username) {
        this.usernameError = 'Username is required.';
        return;
      }
      if (!this.email) {
        this.emailError = 'Email address is required.';
        return;
      } else if (!emailPattern.test(this.email)) {
        this.emailError = 'Please enter a valid email address.';
        return;
      }
      if (!this.firstName) {
        this.firstNameError = 'First Name is required.';
        return;
      } else if (!namePattern.test(this.firstName)) {
        this.firstNameError = 'First Name must contain only letters.';
        return;
      }
      if (!this.lastName) {
        this.lastNameError = 'Last Name is required.';
        return;
      } else if (!namePattern.test(this.lastName)) {
        this.lastNameError = 'Last Name must contain only letters.';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match.';
        return;
      }

      // Send the data to the backend
      this.loading = true;
      try {
        const response = await api.post('/signup', {
          username: this.username,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          password: this.password,
        });

        // Handle successful signup with received token
        if (response.data.success) {
          console.log('Signup successful. Saving token and redirecting to dashboard.');
          localStorage.setItem('token', response.data.token); // Save token to local storage
          this.$router.push('/dashboard'); // Redirect to dashboard
        } else {
          alert('Signup failed: ' + response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          if (error.response.data.error.includes('Username')) {
            this.usernameError = error.response.data.error;
          } else if (error.response.data.error.includes('Email')) {
            this.emailError = error.response.data.error;
          } else {
            alert('An error occurred: ' + error.response.data.error);
          }
        } else {
          alert('An unexpected error occurred.');
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
.signup-container {
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
  justify-content: space-between;
  align-items: center;
}

/* Signup Section */
.signup-section {
  text-align: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
}

.signup-content h1 {
  font-size: 3rem;
  color: #a03acd;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.signup-form {
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

button:hover {
  background-color: #2e177a;
  transform: scale(1.05);
}

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 5px;
}

.login-link {
  margin-top: 20px;
  color: #00e5ff;
  font-size: 1.2rem;
}

.login-link a {
  color: #ff5722;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Footer Section */
.footer {
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
}

.footer p {
  color: #999;
}
</style>
