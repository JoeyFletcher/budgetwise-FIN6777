<template>
  <div class="login-container" style="background-image: url('/HomePageBG.png');">
    <!-- Login Form Section -->
    <section class="login-section">
      <div class="login-content">
        <h1>Login to Budgetwise</h1>
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
          <button type="button" @click="submitLogin">Login</button>
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
export default {
  name: 'LoginPage',
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      usernameOrEmailError: '',
      passwordError: ''
    };
  },
  methods: {
    async submitLogin() {
      // Clear previous errors
      this.usernameOrEmailError = '';
      this.passwordError = '';

      // Basic frontend validation
      if (!this.usernameOrEmail) {
        this.usernameOrEmailError = 'Username or email is required.';
      }

      if (!this.password) {
        this.passwordError = 'Password is required.';
      }

      if (!this.usernameOrEmailError && !this.passwordError) {
        try {
          // Placeholder for backend API call
          // You would replace the URL below with your actual login API endpoint
          const response = await fetch('https://api.example.com/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              usernameOrEmail: this.usernameOrEmail,
              password: this.password
            })
          });

          const data = await response.json();

          if (response.ok) {
            console.log('User logged in:', data);
            // Handle successful login (e.g., save token, redirect to dashboard)
          } else {
            // Handle errors from the server
            this.usernameOrEmailError = data.message || 'Login failed. Please try again.';
          }
        } catch (error) {
          console.error('Error during login:', error);
          this.usernameOrEmailError = 'An error occurred. Please try again later.';
        }
      }
    }
  }
};
</script>

<style scoped>
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
}

.login-content h1 {
  font-size: 3rem;
  color: #00e5ff;
  margin-bottom: 30px;
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
