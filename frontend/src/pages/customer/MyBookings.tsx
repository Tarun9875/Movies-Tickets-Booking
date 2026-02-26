// frontend/src/pages/customer/MyBookings.tsx

import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";

interface Booking {
  id: string;
  movieTitle: string;
  selectedSeats: string[];
  selectedDate: string;
  selectedTime: string;
  selectedLanguage: string;
  totalAmount: number;
  bookedAt: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(stored);
  }, []);

  const cancelBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("myBookings", JSON.stringify(updated));
  };

  return (
    <PageContainer>
      <div
        className="max-w-6xl mx-auto px-4 py-10"
        style={{
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        <h1 className="text-3xl font-bold mb-8">🎟 My Bookings</h1>

        {bookings.length === 0 ? (
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
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl p-6 shadow-sm transition hover:shadow-lg"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">

                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {booking.movieTitle}
                    </h2>

                    <p style={{ color: "var(--muted-text)" }}>
                      📅 {booking.selectedDate}
                    </p>

                    <p style={{ color: "var(--muted-text)" }}>
                      ⏰ {booking.selectedTime}
                    </p>

                    <p style={{ color: "var(--muted-text)" }}>
                      🎥 {booking.selectedLanguage}
                    </p>

                    <p className="mt-3">
                      🎫 Seats: {booking.selectedSeats.join(", ")}
                    </p>

                    <p className="font-semibold mt-2 text-lg">
                      ₹{booking.totalAmount}
                    </p>

                    <p
                      className="text-xs mt-2"
                      style={{ color: "var(--muted-text)" }}
                    >
                      Booked on: {booking.bookedAt}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Cancel Booking
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}