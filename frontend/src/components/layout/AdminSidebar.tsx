// frontend/src/components/admin/AdminSidebar.tsx

import {
  Home,
  Film,
  Calendar,
  Users,
  Settings,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminSidebar({ open }: Props) {
  return (
    <aside
      className={`
        ${open ? "w-64" : "w-20"}
        h-screen
        transition-all duration-300
        border-r
        flex flex-col
      `}
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Logo */}
      <div
        className="p-4 font-bold text-xl tracking-wide"
        style={{ color: "var(--primary-color)" }}
      >
        {open ? "🎬 Admin Panel" : "🎬"}
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-2 flex-1">
        <SidebarItem
          to="/admin"
          icon={<Home size={20} />}
          label="Dashboard"
          open={open}
        />
        <SidebarItem
          to="/admin/movies"
          icon={<Film size={20} />}
          label="Movies"
          open={open}
        />
        <SidebarItem
          to="/admin/shows"
          icon={<Calendar size={20} />}
          label="Shows"
          open={open}
        />
        <SidebarItem
          to="/admin/bookings"
          icon={<ClipboardList size={20} />}
          label="Bookings"
          open={open}
        />
        <SidebarItem
          to="/admin/reports"
          icon={<BarChart3 size={20} />}
          label="Reports"
          open={open}
        />
        <SidebarItem
          to="/admin/users"
          icon={<Users size={20} />}
          label="Users"
          open={open}
        />
        <SidebarItem
          to="/admin/settings"
          icon={<Settings size={20} />}
          label="Settings"
          open={open}
        />
      </nav>
    </aside>
  );
}

function SidebarItem({ to, icon, label, open }: any) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-3 rounded-lg mx-2
        transition-all duration-200
        hover:scale-[1.02]
        ${isActive ? "shadow-md" : ""}
      `
      }
      style={({ isActive }) => ({
        backgroundColor: isActive
          ? "var(--primary-color)"
          : "transparent",
        color: isActive ? "#fff" : "var(--text-color)",
      })}
    >
      {icon}
      {open && <span className="font-medium">{label}</span>}
    </NavLink>
  );
}