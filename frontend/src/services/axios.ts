// frontend/src/services/axios.ts

import axios from "axios";

/**
 * ===============================
 *  BASE URL CONFIG
 * ===============================
 */
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

/**
 * ===============================
 *  API BASE URL
 * ===============================
 */
export const API_URL = `${BASE_URL}/api`;

/**
 * ===============================
 *  AXIOS INSTANCE
 * ===============================
 */
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * ===============================
 *  REQUEST INTERCEPTOR
 * ===============================
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ===============================
 *  RESPONSE INTERCEPTOR
 * ===============================
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;