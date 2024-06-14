// src/utils/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000', // Utilisez le port que votre backend écoute
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
