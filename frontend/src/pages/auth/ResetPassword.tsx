// frontend/src/pages/auth/ResetPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import toast from "react-hot-toast"; // 🔥 Added

export default function ResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleReset = async () => {
    if (!email) {
      toast.error("Email is required ❌");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Loading Toast
      const loadingToast = toast.loading("Sending reset link...");

      await sendPasswordResetEmail(auth, email);

      toast.dismiss(loadingToast);

      toast.success("📩 Reset link sent! Check your email.");

    } catch (err: any) {
      toast.error(
        err.message || "Failed to send reset email ❌"
      );
    } finally {
      setLoading(false);
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
          Reset Password
        </h2>

        <div className="mt-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-400 to-indigo-500 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/40 transition-all disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>

        <p className="mt-6 text-sm text-center text-gray-300">
          Back to{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
