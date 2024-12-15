import axios from 'axios';
import {BASE_URL} from "../constants.ts";

const API_URL = BASE_URL; // Define la URL base para reutilización

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name?: string; // Si necesitas un nombre en el registro, pero lo haces opcional
}

export interface AuthResponse {
  token: string;
}

// Configurar un cliente Axios con un interceptor para incluir el token
const API = axios.create({
  baseURL: API_URL, // Usa la constante para la URL base
});

// Interceptor para agregar el token a cada solicitud
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado
  }
  return config;
});

// Servicios de autenticación
export const register = async (data: RegisterData): Promise<void> => {
  await API.post(`${API_URL}/auth/register`, data); // Llama a /auth/register
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await API.post(`${API_URL}/auth/login`, data); // Llama a /auth/login
  localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token'); // Elimina el token del almacenamiento local
};

export const getToken = (): string | null => {
  return localStorage.getItem('token'); // Devuelve el token almacenado
};

// Función de prueba para rutas protegidas
export const fetchProtectedData = async (endpoint: string) => {
  const response = await API.get(endpoint); // Usa el cliente configurado
  return response.data;
};
