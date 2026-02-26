import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/axios";

export default function AdminShows() {
  const [shows, setShows] = useState<any[]>([]);
  const [filteredShows, setFilteredShows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchShows = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shows");
      setShows(res.data.shows);
      setFilteredShows(res.data.shows);
      setError("");
    } catch {
      setError("Failed to load shows.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // ================= SEARCH + FILTER =================
  useEffect(() => {
    let updated = [...shows];

    if (search.trim()) {
      updated = updated.filter((show) =>
        show.movie?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      updated = updated.filter(
        (show) => show.status === statusFilter
      );
    }

    setFilteredShows(updated);
  }, [search, statusFilter, shows]);

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;

    try {
      await api.delete(`/shows/${id}`);
      fetchShows();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (show: any) => {
    const newStatus =
      show.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await api.put(`/shows/${show._id}`, {
        ...show,
        status: newStatus,
      });
      fetchShows();
    } catch {
      alert("Status update failed");
    }
  };

  return (
    <div
      className="transition-colors"
      style={{ color: "var(--text-color)" }}
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          🎟 Manage Shows
        </h1>

        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Search by movie..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <Link
            to="/admin/shows/add"
            className="px-5 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
            }}
          >
            + Add Show
          </Link>
        </div>
      </div>

      {/* ================= STATES ================= */}
      {loading && (
        <p style={{ color: "var(--muted-text)" }}>
          Loading shows...
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && filteredShows.length === 0 && (
        <div
          className="p-10 text-center rounded-xl"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--muted-text)",
          }}
        >
          No shows found.
        </div>
      )}

      {/* ================= SHOW GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredShows.map((show) => (
          <div
            key={show._id}
            className="p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 className="font-semibold text-lg mb-2">
              {show.movie?.title}
            </h2>

            <div
              className="text-sm space-y-1"
              style={{ color: "var(--muted-text)" }}
            >
              <p>📅 {show.date}</p>
              <p>⏰ {show.time}</p>
              <p>🎥 {show.language}</p>
              <p>🏢 Screen {show.screen}</p>
              <p>💰 ₹{show.price}</p>
            </div>

            {/* STATUS */}
            <div className="mt-4">
              <span
                className="px-3 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor:
                    show.status === "ACTIVE"
                      ? "#16a34a"
                      : "#f59e0b",
                  color: "#fff",
                }}
              >
                {show.status}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-5 flex-wrap">
              <Link
                to={`/admin/shows/edit/${show._id}`}
                className="flex-1 text-center py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                }}
              >
                Edit
              </Link>

              <Link
                to={`/admin/shows/${show._id}/seats`}
                className="flex-1 text-center py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                }}
              >
                Seats
              </Link>

              <button
                onClick={() => handleDelete(show._id)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => toggleStatus(show)}
              className="w-full mt-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              Toggle Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}