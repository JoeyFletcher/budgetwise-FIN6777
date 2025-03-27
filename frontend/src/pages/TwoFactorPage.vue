<template>
  <div class="twofactor-container" style="background-image: url('/DBDarkBG.png');">
    <!-- Logo Section -->
    <div class="logo-container">
      <img src="/BudgetWise.png" alt="Budgetwise Logo" class="responsive-logo">
    </div>
    <!-- TODO style the page rename classes -->
    <section class="signup-section">
      <div class="signup-content">
        <h1>Enter 2fa code</h1>
        <form class="signup-form" @submit.prevent="submitSignup">
          <div class="form-field">
            <label for="twoFactorCode"> Enter Code:</label>
            <input type="text" id="twoFactorCode" v-model="twoFactorCode" />
          </div>
          <button type="button" @click="submitCode">Enter</button>
        </form>
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
  name: 'TwoFactorPage',
  data() {
    return {
      twoFactorCode:""
    };
  },
  methods: {
    async submitCode(){
      if (!this.twoFactorCode) {
        console.log("two factor code not provided");
        return;
      }
      console.log(this.twoFactorCode)
      console.log("sending request")
      try {
        const response = await api.post('/auth/twofactauthcheck', {
          twoFactorCode: this.twoFactorCode,
        });
        if (response.status !== 200) {
         throw new Error("request was unsuccessful");
        } else {
          this.$router.push('/dashboard'); // Redirect to dashboard
        }

        console.log(response)
      } catch (e) {
        console.log(e)
        return
      }
    }

  }
}
</script>

