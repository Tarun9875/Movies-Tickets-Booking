// frontend/src/services/axios.ts

import axios from "axios";

/* ===============================
   BASE URL
================================ */
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const API_URL = `${BASE_URL}/api`;

/* ===============================
   AXIOS INSTANCE
================================ */
const api = axios.create({
  baseURL: API_URL,
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    // 🔥 IMPORTANT: Use SAME KEY as login
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Session expired");
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  }
);

export default api;