// frontend/src/pages/customer/MyBookings.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";

interface Booking {
  _id: string;
  movieTitle: string;
  selectedDate: string;
  selectedTime: string;
  selectedLanguage: string;
  seats: string[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH BOOKINGS ================= */

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= CANCEL BOOKING ================= */

  const cancelBooking = async (id: string) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch {
      alert("Cancel failed");
    }
  };

  /* ================= UI ================= */

  return (
    <PageContainer>
      <div
        className="max-w-6xl mx-auto px-4 py-10"
        style={{
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        <h1 className="text-3xl font-bold mb-8">
          🎟 My Bookings
        </h1>

        {loading && <p>Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <div
            className="rounded-xl p-8 text-center"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p style={{ color: "var(--muted-text)" }}>
              You haven't booked any tickets yet.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl p-6 shadow-sm transition hover:shadow-lg"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">

                {/* LEFT SIDE DETAILS */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    🎬 {booking.movieTitle}
                  </h2>

                  <p style={{ color: "var(--muted-text)" }}>
                    📅 {booking.selectedDate}
                  </p>

                  <p style={{ color: "var(--muted-text)" }}>
                    ⏰ {booking.selectedTime}
                  </p>

                  <p style={{ color: "var(--muted-text)" }}>
                    🌐 {booking.selectedLanguage}
                  </p>

                  <p className="mt-3">
                    🎟 Seats: {booking.seats.join(", ")}
                  </p>

                  <p className="mt-2">
                    💳 Payment: {booking.paymentMethod}
                  </p>

                  <p className="font-semibold mt-2 text-lg">
                    💰 ₹{booking.totalAmount}
                  </p>

                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--muted-text)" }}
                  >
                    🕒 Booked on:{" "}
                    {new Date(
                      booking.createdAt
                    ).toLocaleString()}
                  </p>

                  <p className="text-xs mt-1 opacity-70">
                    🧾 Booking ID: {booking._id}
                  </p>
                </div>

                {/* RIGHT SIDE STATUS + ACTION */}
                <div className="flex flex-col justify-between items-end">

                  {/* STATUS BADGE */}
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3 mt-6">

                    {booking.status === "CONFIRMED" && (
                      <>
                        <button
                          onClick={() =>
                            navigate("/ticket", {
                              state: booking,
                            })
                          }
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          View Ticket
                        </button>

                        <button
                          onClick={() =>
                            cancelBooking(booking._id)
                          }
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {booking.status === "CANCELLED" && (
                      <span className="text-sm text-red-500 mt-2">
                        Booking Cancelled
                      </span>
                    )}

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}