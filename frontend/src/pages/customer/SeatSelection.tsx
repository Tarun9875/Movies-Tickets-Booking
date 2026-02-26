// frontend/src/pages/customer/SeatSelection.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { moviesData } from "../../assets/images/movies/moviesData";

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const movie = moviesData.find((m) => m.id === showId);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [expired, setExpired] = useState(false);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const toggleSeat = (seat: string) => {
    if (expired || !selectedDate || !selectedTime) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const totalPrice = selectedSeats.length * 250;

  const next5Days = [...Array(5)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toDateString();
  });

  const showTimes = [
    "10:00 AM",
    "01:30 PM",
    "04:30 PM",
    "07:35 PM",
    "10:45 PM",
  ];

  const languages = ["English", "Hindi", "3D", "IMAX"];

  const handleProceed = () => {
    if (
      selectedSeats.length === 0 ||
      !selectedDate ||
      !selectedTime ||
      expired
    )
      return;

    navigate(`/payment/${movie?.id}`, {
      state: {
        movieTitle: movie?.title,
        selectedSeats,
        selectedDate,
        selectedTime,
        selectedLanguage,
        totalPrice,
      },
    });
  };

  const renderSection = (
    title: string,
    price: number,
    rows: string[],
    seatCount: number
  ) => (
    <div className="mb-10">
      <h2
        className="text-center font-semibold mb-4"
        style={{ color: "var(--text-color)" }}
      >
        ₹{price} {title}
      </h2>

      {rows.map((row) => (
        <div key={row} className="flex justify-center gap-2 mb-3">
          {Array.from({ length: seatCount }).map((_, index) => {
            const seatId = `${row}${index + 1}`;
            const isSelected = selectedSeats.includes(seatId);

            return (
              <button
                key={seatId}
                disabled={expired || !selectedDate || !selectedTime}
                onClick={() => toggleSeat(seatId)}
                className="w-8 h-8 text-xs rounded transition"
                style={{
                  backgroundColor: isSelected
                    ? "#16a34a"
                    : "var(--card-bg)",
                  color: isSelected
                    ? "#fff"
                    : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  opacity:
                    expired || !selectedDate || !selectedTime
                      ? 0.4
                      : 1,
                }}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  if (!movie) return null;

  return (
    <PageContainer>
      <div
        className="max-w-7xl mx-auto px-4 py-10 transition-colors"
        style={{
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        {/* ================= TOP SELECTION ================= */}
        <div
          className="rounded-xl p-6 mb-10"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h1 className="text-xl font-semibold mb-6">
            {movie.title}
          </h1>

          {/* Date */}
          <h3 className="mb-2">📅 Select Date</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {next5Days.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className="px-4 py-2 rounded-lg transition"
                style={{
                  backgroundColor:
                    selectedDate === date
                      ? "#dc2626"
                      : "var(--card-bg)",
                  color:
                    selectedDate === date
                      ? "#fff"
                      : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Time */}
          <h3 className="mb-2">⏰ Select Time</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {showTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className="px-4 py-2 rounded-lg transition"
                style={{
                  backgroundColor:
                    selectedTime === time
                      ? "#dc2626"
                      : "var(--card-bg)",
                  color:
                    selectedTime === time
                      ? "#fff"
                      : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Language */}
          <h3 className="mb-2">🎥 Select Language</h3>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className="px-4 py-2 rounded-full transition"
                style={{
                  backgroundColor:
                    selectedLanguage === lang
                      ? "#000"
                      : "var(--card-bg)",
                  color:
                    selectedLanguage === lang
                      ? "#fff"
                      : "var(--text-color)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TIMER ================= */}
        <div
          className="flex justify-between items-center mb-8 p-4 rounded-lg"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p style={{ color: "var(--muted-text)" }}>
            {selectedDate || "Select Date"} |{" "}
            {selectedTime || "Select Time"} | {selectedLanguage}
          </p>

          <div
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: expired ? "#6b7280" : "#dc2626",
              color: "#fff",
            }}
          >
            ⏳ {expired ? "Expired" : formatTime(timeLeft)}
          </div>
        </div>

        {/* ================= LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {renderSection("VIP", 500, ["L"], 14)}
            {renderSection("PREMIUM", 250, ["K","J","I","H","G","F","E"], 20)}
            {renderSection("EXECUTIVE", 230, ["D","C","B"], 17)}
            {renderSection("NORMAL", 210, ["A"], 15)}

            <div className="mt-10 flex justify-center">
              <div
                className="w-3/4 h-3 rounded-full"
                style={{ backgroundColor: "var(--border-color)" }}
              />
            </div>
            <p
              className="text-center text-xs mt-2"
              style={{ color: "var(--muted-text)" }}
            >
              SCREEN
            </p>
          </div>

          {/* SUMMARY */}
          <div
            className="rounded-xl p-6 h-fit lg:sticky lg:top-10"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 className="text-lg font-semibold mb-4">
              Booking Summary
            </h2>

            <p style={{ color: "var(--muted-text)" }}>
              Date: {selectedDate || "-"}
            </p>
            <p style={{ color: "var(--muted-text)" }}>
              Time: {selectedTime || "-"}
            </p>
            <p style={{ color: "var(--muted-text)" }}>
              Language: {selectedLanguage}
            </p>

            <p className="mt-3">
              Seats: {selectedSeats.join(", ") || "None"}
            </p>

            <p className="text-lg font-bold mt-4">
              Total: ₹{totalPrice}
            </p>

            <button
              onClick={handleProceed}
              disabled={
                selectedSeats.length === 0 ||
                expired ||
                !selectedDate ||
                !selectedTime
              }
              className="mt-6 w-full py-3 rounded-lg transition"
              style={{
                backgroundColor:
                  selectedSeats.length === 0 ||
                  expired ||
                  !selectedDate ||
                  !selectedTime
                    ? "#6b7280"
                    : "#dc2626",
                color: "#fff",
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