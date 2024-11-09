<template>
  <div class="signup-container" style="background-image: url('/HomePageBG.png');">
    <!-- Signup Form Section -->
    <section class="signup-section">
      <div class="signup-content">
        <h1>Sign Up for Budgetwise</h1>
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
          <div class="form-field">
            <label for="bank_account">Bank Account Number:</label>
            <input type="text" id="bank_account" v-model="bankAccount" />
            <span v-if="bankAccountError" class="error-message">{{ bankAccountError }}</span>
          </div>
          <div class="form-field">
            <label for="routing_number">Routing Number:</label>
            <input type="text" id="routing_number" v-model="routingNumber" />
            <span v-if="routingNumberError" class="error-message">{{ routingNumberError }}</span>
          </div>
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
import api from '../api';

export default {
  name: 'SignupPage',
  data() {
    return {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      bankAccount: '',
      routingNumber: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      firstNameError: '',
      lastNameError: '',
      bankAccountError: '',
      routingNumberError: '',
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
      this.bankAccountError = '';
      this.routingNumberError = '';

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
      if (!this.bankAccount) {
        this.bankAccountError = 'Bank Account Number is required.';
        return;
      }
      if (!this.routingNumber) {
        this.routingNumberError = 'Routing Number is required.';
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
          bank_account: this.bankAccount,
          routing_number: this.routingNumber
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
  padding: 20px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
  margin-top: auto;
  margin-bottom: auto;
  flex-grow: 1;
}

.signup-content h1 {
  font-size: 2.5rem;
  color: #00e5ff;
  margin-bottom: 20px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  background-color: #ff5722;
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
  background-color: #e64a19;
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
  font-size: 1rem;
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
