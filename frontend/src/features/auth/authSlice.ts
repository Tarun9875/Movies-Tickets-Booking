//frontend/src/features/auth/authSlice.ts
// frontend/src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { loginAPI, registerAPI } from "./authAPI";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false
};

/* ============================
   LOGIN THUNK
============================ */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const res = await loginAPI(data);
    return res.data;
  }
);

/* ============================
   REGISTER THUNK
============================ */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }) => {
    const res = await registerAPI(data);
    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ============================
       SET CREDENTIALS (For Google)
    ============================= */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },

    /* ============================
       LOGOUT
    ============================= */
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      /* ============================
         LOGIN
      ============================= */
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })

      /* ============================
         REGISTER
      ============================= */
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
