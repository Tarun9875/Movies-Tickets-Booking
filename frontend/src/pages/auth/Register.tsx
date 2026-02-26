// frontend/src/pages/auth/Register.tsx
import { useState } from "react";
import { registerAPI, googleAuthAPI } from "../../features/auth/authAPI";
import { setCredentials } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import toast from "react-hot-toast"; // 🔥 Added

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  /* =============================
     NORMAL REGISTER
  ============================== */
  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("All fields are required ❌");
      return;
    }

    try {
      setLoading(true);

      await registerAPI({ name, email, password });

      toast.success("Registration successful 🎉");
      navigate("/login");

    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     GOOGLE REGISTER
  ============================== */
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google token not found ❌");
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

      toast.success("Google Sign Up Successful 🎉");

      navigate("/");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Google Authentication Failed ❌"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#052f35] via-[#0f172a] to-[#312e81] font-[Inter]">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-96 p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white"
      >
        <h2 className="text-3xl font-extrabold text-center">
          Create Account
        </h2>

        <div className="mt-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="mt-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-emerald-400 to-teal-500 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </motion.button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-white/30"></div>
          <span className="px-4 text-gray-300 text-sm">OR</span>
          <div className="flex-grow h-px bg-white/30"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              toast.error("Google Login Failed ❌")
            }
          />
        </div>

        <p className="mt-6 text-sm text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
