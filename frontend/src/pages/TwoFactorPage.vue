<template>
  <div class="twofactor-container" style="background-image: url('/DBDarkBG.png');">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
    </div>
    <!-- Two Factor Authentication Section -->
    <section class="twofactor-section">
      <div class="twofactor-content">
        <h1>Two-Factor Authentication</h1>
        <p>Please enter the verification code sent to your email.</p>
        <form class="twofactor-form" @submit.prevent="submitCode">
          <div class="form-field">
            <label for="twoFactorCode">Verification Code:</label>
            <input 
              type="text" 
              id="twoFactorCode" 
              v-model="twoFactorCode" 
              placeholder="Enter 6-digit code"
              maxlength="6"
              @input="handleInput"
              pattern="[0-9]*"
              inputmode="numeric"
            />
            <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
          </div>
          <LoadingSpinner v-if="loading" message="Verifying code..." />
          <button type="submit" :disabled="loading || !isValidCode">Verify Code</button>
        </form>
      </div>
    </section>

    <!-- Footer Section -->
    <div class="footer">
      <p>&copy; 2024 Budgetwise. Group 3 Project.</p>
    </div>
  </div>
</template>

<script>
import api from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';

export default {
  name: 'TwoFactorPage',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      twoFactorCode: "",
      errorMessage: "",
      loading: false,
      attempts: 0
    };
  },
  computed: {
    isValidCode() {
      return this.twoFactorCode.length === 6 && /^\d{6}$/.test(this.twoFactorCode);
    }
  },
  methods: {
    handleInput() {
      // Clear previous error when user types
      this.errorMessage = "";
      
      // Auto-submit when 6 valid digits are entered
      if (this.isValidCode && !this.loading) {
        this.submitCode();
      }
    },
    async submitCode() {
      if (!this.isValidCode) {
        this.errorMessage = "Please enter the 6-digit verification code.";
        return;
      }
      
      this.loading = true;
      
      try {
        const response = await api.post('/auth/twofactauthcheck', {
          twoFactorCode: this.twoFactorCode,
        });
        
        if (response.status !== 200) {
          throw new Error("Verification failed");
        }
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          this.$router.push('/dashboard');
        }
      } catch (e) {
        console.error(e);
        this.attempts++;
        
        if (this.attempts >= 3) {
          this.errorMessage = "Too many failed attempts. Redirecting to login...";
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.errorMessage = `Invalid code, please try again (${this.attempts}/3 attempts). If you have not received an email, please check your spam folder.`;
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.logo-container {
  text-align: center;
  padding-top: 20px;
  width: 100%;
}

.responsive-logo {
  width: 100%;
  max-width: 600px;
  height: auto;
}

/* Media Query for Smaller Screens */
@media (max-width: 768px) {
  .responsive-logo {
    max-width: 150px;
  }
}

/* General Container */
.twofactor-container {
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

/* Two Factor Section */
.twofactor-section {
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

.twofactor-content h1 {
  font-size: 3rem;
  color: #a03acd;
  margin-bottom: 5px;
  margin-top: 5px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.twofactor-content p {
  color: #00e5ff;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.twofactor-form {
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

