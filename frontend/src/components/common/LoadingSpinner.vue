<template>
  <div class="spinner-container">
    <div class="spinner"></div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
}

.spinner-container p {
  margin-top: 10px;
  color: #00e5ff;
  font-size: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(160, 58, 205, 0.3);
  border-radius: 50%;
  border-top: 4px solid #a03acd;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 