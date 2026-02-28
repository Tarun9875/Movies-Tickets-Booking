// frontend/src/pages/admin/Users.tsx

import { useEffect, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const data = res.data.users || [];
      setUsers(data);
      setFiltered(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= SEARCH + FILTER ================= */
  useEffect(() => {
    let updated = [...users];

    if (search.trim()) {
      updated = updated.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "ALL") {
      updated = updated.filter((u) => u.role === roleFilter);
    }

    setFiltered(updated);
  }, [search, roleFilter, users]);

  /* ================= DELETE USER ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);

      // Remove from state directly (no full reload)
      setUsers((prev) => prev.filter((u) => u._id !== id));

      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (user: User) => {
    const newStatus =
      user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await api.put(`/users/${user._id}`, {
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, status: newStatus }
            : u
        )
      );

      toast.success(`User ${newStatus}`);
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <div
      className="transition-colors"
      style={{ color: "var(--text-color)" }}
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          👥 Manage Users
        </h1>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg w-full sm:w-64"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
      </div>

      {/* ================= STATES ================= */}
      {loading && (
        <p style={{ color: "var(--muted-text)" }}>
          Loading users...
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <div
          className="p-10 text-center rounded-xl"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--muted-text)",
          }}
        >
          No users found.
        </div>
      )}

      {/* ================= USER GRID ================= */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((user) => (
          <div
            key={user._id}
            className="p-6 rounded-xl shadow-md hover:shadow-lg transition"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 className="font-semibold text-lg mb-1">
              {user.name}
            </h2>

            <p style={{ color: "var(--muted-text)" }}>
              📧 {user.email}
            </p>

            <p style={{ color: "var(--muted-text)" }}>
              🗓 Joined:{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>

            {/* ROLE BADGE */}
            <div className="mt-3">
              <span
                className="px-3 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor:
                    user.role === "ADMIN"
                      ? "#7c3aed"
                      : "#2563eb",
                  color: "#fff",
                }}
              >
                {user.role}
              </span>
            </div>

            {/* STATUS BADGE */}
            <div className="mt-3">
              <span
                className="px-3 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor:
                    user.status === "ACTIVE"
                      ? "#16a34a"
                      : "#dc2626",
                  color: "#fff",
                }}
              >
                {user.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => toggleStatus(user)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                }}
              >
                Toggle Status
              </button>

              <button
                onClick={() => handleDelete(user._id)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}