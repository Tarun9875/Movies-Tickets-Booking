// src/pages/admin/AdminLayout.tsx

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/layout/AdminHeader";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Add admin class when entering admin
    document.documentElement.classList.add("admin");

    return () => {
      // Remove admin class when leaving admin
      document.documentElement.classList.remove("admin");
    };
  }, []);

  return (
    <div
      className="
        flex h-screen
        bg-[var(--bg-color)]
        text-[var(--text-color)]
        transition-colors duration-300
      "
    >
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Area */}
      <div className="flex flex-col flex-1 transition-all duration-300">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main
          className="
            flex-1 p-6 overflow-y-auto
            bg-[var(--bg-color)]
            text-[var(--text-color)]
            transition-colors duration-300
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
