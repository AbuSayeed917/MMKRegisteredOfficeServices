import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

// Always use the production Railway API (has the actual database)
const API_BASE_URL = "https://mmkregisteredofficeservices-production.up.railway.app";

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
