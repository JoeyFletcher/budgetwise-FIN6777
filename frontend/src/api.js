// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this if your backend is running elsewhere
});

// Fetch transactions by user ID
export const getTransactions = (userId) => {
  const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
  return api.get(`/transactions/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default api;
