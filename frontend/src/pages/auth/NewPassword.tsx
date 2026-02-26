// frontend/src/pages/auth/NewPassword.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import toast from "react-hot-toast";

export default function NewPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewPassword = async () => {
    if (!password) {
      toast.error("Password is required ❌");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Show loading toast
      const loadingToast = toast.loading("Updating password...");

      await api.post(`/auth/new-password/${token}`, { password });

      toast.dismiss(loadingToast);

      toast.success("✅ Password updated successfully");

      // Small delay for better UX
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Invalid or expired token ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#052f35] via-[#0f172a] to-[#312e81]">
      <div className="w-96 p-8 bg-white/10 backdrop-blur-xl rounded-2xl text-white shadow-2xl border border-white/20">
        <h2 className="text-2xl font-bold text-center">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <button
          onClick={handleNewPassword}
          disabled={loading}
          className="mt-6 w-full bg-emerald-500 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
