<template>
  <div>
    <!-- Navigation Bar -->
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/signup">Signup</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
      </ul>
    </nav>
    
    <!-- Where the page content will be rendered -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
nav {
  background-color: #f8f9fa;
  padding: 1rem;
}

ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

li {
  display: inline;
}

a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}
</style>
