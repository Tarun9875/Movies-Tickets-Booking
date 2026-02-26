import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { Menu, Bell, LogOut } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
}: AdminHeaderProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className="
        sticky top-0 z-50
        bg-[var(--card-bg)]
        border-b border-[var(--border-color)]
        transition-colors duration-300
        backdrop-blur-md
      "
    >
      <div className="flex items-center justify-between px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="
              p-2 rounded-lg
              hover:bg-[var(--border-color)]
              transition
            "
          >
            <Menu size={22} className="text-[var(--text-color)]" />
          </button>

          <h1 className="text-lg font-semibold text-[var(--text-color)]">
            Admin Dashboard
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative">

          {/* Notification */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              relative p-2 rounded-lg
              hover:bg-[var(--border-color)]
              transition
            "
          >
            <Bell size={20} className="text-[var(--text-color)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary-color)] rounded-full"></span>
          </button>

          {/* Theme */}
          <ThemeToggle />

          {/* User */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className="
                w-8 h-8 rounded-full
                flex items-center justify-center
                text-white font-bold
              "
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              {user?.name?.charAt(0) || "A"}
            </div>

            <span className="text-[var(--text-color)] font-medium">
              {user?.name || "Admin"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => dispatch(logout())}
            className="
              p-2 rounded-lg
              text-white
              transition
            "
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <LogOut size={18} />
          </button>

        </div>
      </div>
    </header>
  );
}
