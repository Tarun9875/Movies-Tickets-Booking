// frontend/src/pages/admin/Bookings.tsx

import { useEffect, useState } from "react";
import api from "../../services/axios";

interface Booking {
  _id: string;
  user?: { name: string; email: string };
  show?: {
    movie?: { title: string };
    date: string;
    time: string;
  };
  seats: string[];
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOKINGS =================
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.bookings);
      setFiltered(res.data.bookings);
    } catch {
      console.log("Using empty bookings fallback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= SEARCH + FILTER =================
  useEffect(() => {
    let updated = [...bookings];

    if (search.trim()) {
      updated = updated.filter((b) =>
        b.show?.movie?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      updated = updated.filter(
        (b) => b.bookingStatus === statusFilter
      );
    }

    setFiltered(updated);
  }, [search, statusFilter, bookings]);

  // ================= CANCEL BOOKING =================
  const cancelBooking = async (id: string) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch {
      alert("Cancel failed");
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
              {booking.show?.movie?.title}
            </h2>

            <div
              className="text-sm space-y-1"
              style={{ color: "var(--muted-text)" }}
            >
              <p>📅 {booking.show?.date}</p>
              <p>⏰ {booking.show?.time}</p>
              <p>👤 {booking.user?.name}</p>
              <p>📧 {booking.user?.email}</p>
              <p>🎟 Seats: {booking.seats.join(", ")}</p>
              <p>💰 ₹{booking.totalAmount}</p>
              <p>
                🕒 {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>

            {/* STATUS BADGES */}
            <div className="flex justify-between items-center mt-4">
              <span
                className="px-3 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor:
                    booking.paymentStatus === "PAID"
                      ? "#16a34a"
                      : "#f59e0b",
                  color: "#fff",
                }}
              >
                {booking.paymentStatus}
              </span>

              <span
                className="px-3 py-1 text-xs rounded-full font-medium"
                style={{
                  backgroundColor:
                    booking.bookingStatus === "CONFIRMED"
                      ? "#2563eb"
                      : "#dc2626",
                  color: "#fff",
                }}
              >
                {booking.bookingStatus}
              </span>
            </div>

            {/* ACTION */}
            {booking.bookingStatus !== "CANCELLED" && (
              <button
                onClick={() => cancelBooking(booking._id)}
                className="w-full mt-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                }}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}