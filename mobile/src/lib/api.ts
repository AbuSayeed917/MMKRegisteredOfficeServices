import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

// Simulator uses localhost, production uses the deployed URL
const API_BASE_URL = __DEV__
  ? "http://localhost:3000"
  : "https://mmkregisteredofficeservices.co.uk";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT Bearer token to every request
api.interceptors.request.use((config) => {
  const { sessionCookie: token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — force logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);
