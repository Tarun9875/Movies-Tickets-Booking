// frontend/src/services/axios.ts

import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token invalid or expired
    if (error.response?.status === 401) {
      console.log("Unauthorized → Logging out");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;