// frontend/src/pages/auth/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginThunk, setCredentials } from "../../features/auth/authSlice";
import { googleAuthAPI } from "../../features/auth/authAPI";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* =============================
     NORMAL LOGIN
  ============================== */
  const handleLogin = async () => {
    try {
      const result = await dispatch(
        loginThunk({ email, password })
      ).unwrap();

      toast.success("Login successful 🎉");

      // 🔥 ROLE-BASED REDIRECT
      if (result.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error: any) {
      toast.error(error?.message || "Login failed ❌");
    }
  };

  /* =============================
     GOOGLE LOGIN
  ============================== */
  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google token missing ❌");
        return;
      }

      const res = await googleAuthAPI(
        credentialResponse.credential
      );

      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.accessToken,
        })
      );

      toast.success("Google Login Successful 🎉");

      // 🔥 ROLE-BASED REDIRECT
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Google Login Failed ❌"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#052f35] via-[#0f172a] to-[#312e81] font-[Inter]">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-96 p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white"
      >
        <h2 className="text-3xl font-extrabold text-center">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 mt-1">
          Login to continue
        </p>

        {/* Email */}
        <div className="mt-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-emerald-400 to-teal-500 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/30" />
          <span className="px-4 text-sm text-gray-300">OR</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login Failed ❌")}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-6 text-sm text-gray-300">
          <Link to="/register" className="hover:text-emerald-400">
            Create account
          </Link>
          <Link to="/reset-password" className="hover:text-emerald-400">
            Forgot?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
