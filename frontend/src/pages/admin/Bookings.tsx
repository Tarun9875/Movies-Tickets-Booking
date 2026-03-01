// frontend/src/pages/admin/Bookings.tsx

import { useEffect, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";

interface Booking {
  _id: string;
  name: string;
  email: string;
  movieTitle: string;
  selectedDate: string;
  selectedTime: string;
  selectedLanguage: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: string;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL BOOKINGS (ADMIN) ================= */
  const fetchBookings = async () => {
    try {
      // 🔥 IMPORTANT FIX
      const res = await api.get("/bookings/admin");

      const data = res.data.bookings || [];

      setBookings(data);
      setFiltered(data);
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("Access denied. Admin only.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= SEARCH + FILTER ================= */
  useEffect(() => {
    let updated = [...bookings];

    if (search.trim()) {
      updated = updated.filter((b) =>
        b.movieTitle
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      updated = updated.filter(
        (b) => b.status === statusFilter
      );
    }

    setFiltered(updated);
  }, [search, statusFilter, bookings]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (
    id: string,
    newStatus: "CONFIRMED" | "CANCELLED"
  ) => {
    if (!window.confirm(`Change status to ${newStatus}?`)) return;

    try {
      await api.put(`/bookings/${id}/status`, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: newStatus } : b
        )
      );

      toast.success(`Booking ${newStatus}`);
    } catch (error: any) {
      console.error(error);
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
          📋 Manage Bookings
        </h1>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
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
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ================= STATES ================= */}
      {loading && (
        <p style={{ color: "var(--muted-text)" }}>
          Loading bookings...
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
          No bookings found.
        </div>
      )}

      {/* ================= BOOKING GRID ================= */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((booking) => (
          <div
            key={booking._id}
            className="p-6 rounded-xl shadow-md hover:shadow-lg transition"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 className="font-semibold text-lg mb-2">
              {booking.movieTitle}
            </h2>

            <div
              className="text-sm space-y-1"
              style={{ color: "var(--muted-text)" }}
            >
              <p>📅 {booking.selectedDate}</p>
              <p>⏰ {booking.selectedTime}</p>
              <p>🌐 {booking.selectedLanguage}</p>
              <p>👤 {booking.name}</p>
              <p>📧 {booking.email}</p>
              <p>🎟 Seats: {booking.seats.join(", ")}</p>
              <p>💰 ₹{booking.totalAmount}</p>
              <p>💳 {booking.paymentMethod}</p>
              <p>
                🕒 {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>

            {/* STATUS */}
            <div className="mt-5 space-y-3">
              <span
                className="px-3 py-1 text-xs rounded-full font-medium inline-block"
                style={{
                  backgroundColor:
                    booking.status === "CONFIRMED"
                      ? "#16a34a"
                      : "#dc2626",
                  color: "#fff",
                }}
              >
                {booking.status}
              </span>

              <select
                value={booking.status}
                onChange={(e) =>
                  updateStatus(
                    booking._id,
                    e.target.value as
                      | "CONFIRMED"
                      | "CANCELLED"
                  )
                }
                className="w-full py-2 px-3 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor:
                    booking.status === "CONFIRMED"
                      ? "#16a34a"
                      : "#dc2626",
                  color: "#fff",
                  border: "none",
                }}
              >
                <option value="CONFIRMED">
                  CONFIRMED
                </option>
                <option value="CANCELLED">
                  CANCELLED
                </option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}