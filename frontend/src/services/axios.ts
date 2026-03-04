// frontend/src/services/axios.ts
import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

/* =================================
   REQUEST INTERCEPTOR
================================== */
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

/* =================================
   RESPONSE INTERCEPTOR
================================== */
api.interceptors.response.use(
  (response) => response,

  (error) => {

    const status = error.response?.status;

    /* TOKEN EXPIRED */
    if (status === 401) {

      console.log("Session expired → redirect login");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    /* FORBIDDEN (ROLE ERROR) */
    if (status === 403) {
      console.warn("Forbidden request (permission issue)");
    }

    return Promise.reject(error);
  }
);

export default api;