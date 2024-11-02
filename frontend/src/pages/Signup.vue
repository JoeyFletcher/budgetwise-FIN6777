<template>
  <div>
    <h1>Signup</h1>
    <form @submit.prevent="handleSignup">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <button type="submit">Signup</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  methods: {
    handleSignup() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
      } else {
        console.log('Signing up with:', this.email, this.password);
        // Add logic to create the user account with backend in future
      }
    },
  },
};
</script>

<style scoped>
form {
  margin-top: 1rem;
}
label {
  display: block;
  margin-top: 1rem;
}
button {
  margin-top: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
