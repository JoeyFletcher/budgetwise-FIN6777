//api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this if your backend is running elsewhere
});

export default api;
