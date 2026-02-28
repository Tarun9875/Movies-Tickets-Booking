//frontend/src/features/auth/authAPI.ts
import api from "../../services/axios";

/* ============================= */
/*         TYPE DEFINITIONS      */
/* ============================= */

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface GoogleAuthData {
  token: string;
}

/* ============================= */
/*         AUTH APIs             */
/* ============================= */

// 🔐 Normal Login
export const loginAPI = (data: LoginData) =>
  api.post("/auth/login", data);

// 📝 Normal Register
export const registerAPI = (data: RegisterData) =>
  api.post("/auth/register", data);

// 🔵 Google Login / Register
export const googleAuthAPI = (token: string) =>
  api.post("/auth/google", { token });
