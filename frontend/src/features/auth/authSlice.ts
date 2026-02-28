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
  token: localStorage.getItem("accessToken"), // ✅ FIXED
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
       SET CREDENTIALS (Google)
    ============================= */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ STORE CORRECT KEY
      localStorage.setItem("accessToken", action.payload.token);
    },

    /* ============================
       LOGOUT
    ============================= */
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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

        // ⚠️ IMPORTANT: Check backend field name
        const token =
          action.payload.accessToken || action.payload.token;

        state.token = token;

        // ✅ STORE CORRECT KEY
        localStorage.setItem("accessToken", token);
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