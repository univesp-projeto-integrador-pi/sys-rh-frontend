import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Endereço que vimos no seu swagger
});

export default api;