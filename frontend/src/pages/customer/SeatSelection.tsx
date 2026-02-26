// frontend/src/pages/customer/SeatSelection.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";
import { toast } from "react-toastify";

interface SeatCategory {
  type: string;
  price: number;
  rows: string[];
  seatsPerRow: number;
}

interface ShowData {
  _id: string;
  movie: { title: string };
  date: string;
  time: string;
  language: string;
  screen: number;
  seatCategories: SeatCategory[];
}

interface SeatState {
  booked: string[];
}

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowData | null>(null);
  const [seatState, setSeatState] = useState<SeatState>({ booked: [] });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await api.get(`/shows/${showId}`);
        setShow(showRes.data.show);

        const seatRes = await api.get(`/shows/${showId}/seats`);
        setSeatState(seatRes.data);
      } catch (error: any) {
        toast.error("Failed to load seat data ❌");
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchData();
  }, [showId]);

  /* ================= TOGGLE SEAT ================= */
  const toggleSeat = (seat: string) => {
    if (seatState.booked.includes(seat)) {
      toast.warning("Seat already booked 🔴");
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  /* ================= TOTAL PRICE ================= */
  const calculateTotal = () => {
    if (!show) return 0;

    let total = 0;

    show.seatCategories.forEach((category) => {
      category.rows.forEach((row) => {
        selectedSeats.forEach((seat) => {
          if (seat.startsWith(row)) {
            total += category.price;
          }
        });
      });
    });

    return total;
  };

  const totalPrice = calculateTotal();

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageContainer>
        <div className="py-40 text-center">
          Loading seats...
        </div>
      </PageContainer>
    );
  }

  if (!show) {
    return (
      <PageContainer>
        <div className="py-40 text-center">
          Show not found ❌
        </div>
      </PageContainer>
    );
  }

  /* ================= PROCEED ================= */
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select seats");
      return;
    }

    navigate(`/payment/${showId}`, {
      state: {
        showId,
        movieTitle: show.movie.title,
        selectedSeats,
        totalPrice,
      },
    });
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-bold mb-2">
          {show.movie.title}
        </h1>
        <p className="mb-8 text-sm opacity-70">
          {show.date} | {show.time} | {show.language} | Screen {show.screen}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* SEATS */}
          <div className="lg:col-span-2">

            {show.seatCategories.map((category) => (
              <div key={category.type} className="mb-10">
                <h2 className="text-center font-semibold mb-4">
                  ₹{category.price} {category.type}
                </h2>

                {category.rows.map((row) => (
                  <div key={row} className="flex justify-center gap-2 mb-3">
                    {Array.from({ length: category.seatsPerRow }).map((_, index) => {
                      const seatId = `${row}${index + 1}`;

                      const isBooked = seatState.booked.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={isBooked}
                          className="w-8 h-8 text-xs rounded"
                          style={{
                            backgroundColor: isBooked
                              ? "#dc2626"
                              : isSelected
                              ? "#16a34a"
                              : "var(--card-bg)",
                            color: isBooked || isSelected ? "#fff" : "var(--text-color)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}

            <div className="mt-10 flex justify-center">
              <div className="w-2/3 h-3 rounded-full bg-gray-400" />
            </div>
            <p className="text-center mt-2 text-xs opacity-70">
              SCREEN
            </p>
          </div>

          {/* SUMMARY */}
          <div className="p-6 rounded-xl shadow-md h-fit sticky top-10"
               style={{
                 backgroundColor: "var(--card-bg)",
                 border: "1px solid var(--border-color)",
               }}>
            <h2 className="text-lg font-semibold mb-4">
              Booking Summary
            </h2>

            <p>Seats: {selectedSeats.join(", ") || "None"}</p>
            <p className="mt-4 font-bold text-lg">
              Total: ₹{totalPrice}
            </p>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="mt-6 w-full py-3 rounded-lg text-white"
              style={{
                backgroundColor:
                  selectedSeats.length === 0
                    ? "#6b7280"
                    : "#dc2626",
              }}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}