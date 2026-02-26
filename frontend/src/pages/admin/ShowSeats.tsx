// frontend/src/pages/admin/ShowSeats.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/axios";

interface SeatCategory {
  type: string;
  price: number;
  rows: string[];
  seatsPerRow: number;
}

interface ShowData {
  movieTitle: string;
  date: string;
  time: string;
  screen: number;
  seatCategories: SeatCategory[];
}

interface SeatState {
  booked: string[];
  blocked: string[];
}

export default function ShowSeats() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowData | null>(null);
  const [seatState, setSeatState] = useState<SeatState>({
    booked: [],
    blocked: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= FETCH SHOW + SEATS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await api.get(`/shows/${showId}`);
        setShow(showRes.data.show);

        const seatRes = await api.get(`/shows/${showId}/seats`);
        setSeatState(seatRes.data);
      } catch {
        toast.error("Failed to load seat data ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  // ================= TOGGLE BLOCK =================
  const toggleBlock = (seat: string) => {
    if (seatState.booked.includes(seat)) {
      toast.warning("Cannot block booked seat 🔴");
      return;
    }

    setSeatState((prev) => ({
      ...prev,
      blocked: prev.blocked.includes(seat)
        ? prev.blocked.filter((s) => s !== seat)
        : [...prev.blocked, seat],
    }));
  };

  // ================= SAVE =================
  const saveChanges = async () => {
    try {
      setSaving(true);

      await api.put(`/shows/${showId}/seats`, {
        blocked: seatState.blocked,
      });

      toast.success("Seat layout updated successfully 🎉");
    } catch {
      toast.error("Failed to update seats ❌");
    } finally {
      setSaving(false);
    }
  };

  // ================= RESET =================
  const resetBlocked = () => {
    setSeatState((prev) => ({
      ...prev,
      blocked: [],
    }));

    toast.info("Blocked seats reset");
  };

  // ================= RENDER ROW =================
  const renderRow = (
    row: string,
    seatsPerRow: number
  ) => (
    <div key={row} className="flex justify-center gap-2 mb-3">
      <div className="w-6 font-bold text-sm">{row}</div>

      {Array.from({ length: seatsPerRow }).map((_, index) => {
        const seatId = `${row}${index + 1}`;

        const isBooked = seatState.booked.includes(seatId);
        const isBlocked = seatState.blocked.includes(seatId);

        return (
          <button
            key={seatId}
            onClick={() => toggleBlock(seatId)}
            className="w-8 h-8 text-xs rounded transition"
            style={{
              backgroundColor: isBooked
                ? "#dc2626"
                : isBlocked
                ? "#f59e0b"
                : "var(--card-bg)",
              color:
                isBooked || isBlocked
                  ? "#fff"
                  : "var(--text-color)",
              border: "1px solid var(--border-color)",
              cursor: isBooked ? "not-allowed" : "pointer",
            }}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );

  if (loading || !show) {
    return <p style={{ color: "var(--text-color)" }}>Loading seats...</p>;
  }

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
       style={{ color: "var(--text-color)" }}>

    {/* ================= HEADER ================= */}
    <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-6">

      {/* LEFT SIDE */}
      <div className="w-full">
        <button
          onClick={() => navigate("/admin/shows")}
          className="mb-3 text-sm opacity-70 hover:opacity-100"
        >
          ← Back to Shows
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold">
          🎟 Manage Seats
        </h1>

        <p className="text-xs sm:text-sm opacity-70 mt-1 break-words">
          {show.movieTitle} | {show.date} | {show.time} | Screen {show.screen}
        </p>
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <button
          onClick={resetBlocked}
          className="w-full sm:w-auto px-4 py-2 rounded bg-gray-600 text-white"
        >
          Reset Blocked
        </button>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="w-full sm:w-auto px-4 py-2 rounded bg-green-600 text-white"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>

    {/* ================= LEGEND ================= */}
    <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-600 rounded" />
        Booked
      </div>

      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-500 rounded" />
        Blocked
      </div>

      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded"
          style={{ border: "1px solid var(--border-color)" }}
        />
        Available
      </div>
    </div>

    {/* ================= SEAT LAYOUT ================= */}
    <div
      className="p-4 sm:p-8 rounded-2xl overflow-x-auto"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="min-w-[600px]">

        {show.seatCategories.map((category) => (
          <div key={category.type} className="mb-8">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              {category.type} (₹{category.price})
            </h2>

            {category.rows.map((row) => (
              <div key={row} className="flex justify-center gap-1 sm:gap-2 mb-3">
                <div className="w-5 sm:w-6 font-bold text-xs sm:text-sm">
                  {row}
                </div>

                {Array.from({ length: category.seatsPerRow }).map((_, index) => {
                  const seatId = `${row}${index + 1}`;
                  const isBooked = seatState.booked.includes(seatId);
                  const isBlocked = seatState.blocked.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleBlock(seatId)}
                      className="w-6 h-6 sm:w-8 sm:h-8 text-[10px] sm:text-xs rounded transition"
                      style={{
                        backgroundColor: isBooked
                          ? "#dc2626"
                          : isBlocked
                          ? "#f59e0b"
                          : "var(--card-bg)",
                        color:
                          isBooked || isBlocked
                            ? "#fff"
                            : "var(--text-color)",
                        border: "1px solid var(--border-color)",
                        cursor: isBooked ? "not-allowed" : "pointer",
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

        {/* SCREEN */}
        <div className="mt-8 flex justify-center">
          <div
            className="w-2/3 sm:w-1/2 h-2 sm:h-3 rounded-full"
            style={{ backgroundColor: "var(--border-color)" }}
          />
        </div>
        <p className="text-center mt-2 text-xs sm:text-sm opacity-70">
          SCREEN
        </p>

      </div>
    </div>
  </div>
);
}