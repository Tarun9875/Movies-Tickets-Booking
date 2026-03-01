import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";
import { toast } from "react-toastify";

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
      const res = await api.get("/bookings/my"); // ✅ FIXED HERE
      setBookings(res.data.bookings || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch bookings"
      );
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
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Cancel failed"
      );
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

                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    🎬 {booking.movieTitle}
                  </h2>

                  <p>📅 {booking.selectedDate}</p>
                  <p>⏰ {booking.selectedTime}</p>
                  <p>🌐 {booking.selectedLanguage}</p>
                  <p>🎟 Seats: {booking.seats.join(", ")}</p>
                  <p>💳 Payment: {booking.paymentMethod}</p>
                  <p className="font-semibold">
                    💰 ₹{booking.totalAmount}
                  </p>
                  <p className="text-xs opacity-70">
                    🕒 {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-end">

                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status === "CONFIRMED" && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() =>
                          navigate("/ticket", { state: booking })
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
                    </div>
                  )}

                  {booking.status === "CANCELLED" && (
                    <span className="text-sm text-red-500 mt-2">
                      Booking Cancelled
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}