<template>
  <div class="signup-container" style="background-image: url('/HomePageBG.png');">
    <!-- Signup Form Section -->
    <section class="signup-section">
      <div class="signup-content">
        <h1>Sign Up for Budgetwise</h1>
        <form class="signup-form">
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
          <button type="button" @click="submitSignup">Sign Up</button>
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
      usernameError: '',
      emailError: '',
      passwordError: '',
      firstNameError: '',
      lastNameError: ''
    };
  },
  methods: {
    submitSignup() {
      // Clear previous errors
      this.usernameError = '';
      this.emailError = '';
      this.passwordError = '';
      this.firstNameError = '';
      this.lastNameError = '';

      // Basic frontend validation
      if (!this.username) {
        this.usernameError = 'Username is required.';
      } else if (this.usernameExists(this.username)) {
        this.usernameError = 'Username already exists.';
      }

      if (!this.email) {
        this.emailError = 'Email address is required.';
      } else if (this.emailExists(this.email)) {
        this.emailError = 'Email address is already registered.';
      }

      if (!this.firstName) {
        this.firstNameError = 'First Name is required.';
      }

      if (!this.lastName) {
        this.lastNameError = 'Last Name is required.';
      }

      if (this.password !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match.';
      }

      if (!this.usernameError && !this.emailError && !this.passwordError && !this.firstNameError && !this.lastNameError) {
        console.log('User signed up with:', this.username, this.email, this.firstName, this.lastName, this.password);
      }
    },
    usernameExists(username) {
      // Placeholder logic for checking if the username exists
      // This would be replaced with an actual API call
      const existingUsernames = ['testuser', 'sampleuser'];
      return existingUsernames.includes(username);
    },
    emailExists(email) {
      // Placeholder logic for checking if the email exists
      // This would be replaced with an actual API call
      const existingEmails = ['test@example.com', 'sample@example.com'];
      return existingEmails.includes(email);
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
