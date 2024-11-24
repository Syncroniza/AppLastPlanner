// src/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // URL base del backend
});

// Interceptor para agregar el token al encabezado Authorization
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado
  }
  return config;
});

export default API;
