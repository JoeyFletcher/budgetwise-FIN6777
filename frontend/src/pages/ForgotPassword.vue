<template>
    <section class="forgot-password-section">
      <div class="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you instructions to reset your password.</p>
        <form @submit.prevent="handleForgotPassword" class="forgot-password-form">
          <div class="form-field">
            <label for="email">Email Address:</label>
            <input type="email" id="email" v-model="email" required />
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>
          <button type="submit">Send Reset Link</button>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email: '',
        emailError: '',
        successMessage: '',
      };
    },
    methods: {
      handleForgotPassword() {
        // Clear previous errors
        this.emailError = '';
        this.successMessage = '';
  
        // Validate email
        if (!this.email) {
          this.emailError = 'Email is required.';
          return;
        }
  
        // For now, simulate sending reset link
        this.successMessage = `If an account with the email ${this.email} exists, a reset link has been sent.`;
        this.email = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .forgot-password-section {
    padding: 40px;
    background-color: #f5f5f5;
    border-radius: 15px;
    font-family: 'Arial, sans-serif';
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .forgot-password-container {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    text-align: center;
  }
  
  .forgot-password-container h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  .forgot-password-container p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 20px;
  }
  
  .forgot-password-form {
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
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  button:hover {
    background-color: #2e177a;
    transform: scale(1.05);
  }
  
  .error-message {
    color: #ff4444;
    font-size: 0.9rem;
  }
  
  .success-message {
    color: #28a745;
    font-size: 1rem;
    margin-top: 10px;
  }
  </style>
  