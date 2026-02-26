// frontend/src/pages/admin/EditShow.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axios";

export default function EditShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    movie: "",
    date: "",
    time: "",
    screen: 1,
    language: "English",
    format: "2D",
    maxSeatsPerBooking: 6,
    weekendMultiplier: 1,
    status: "ACTIVE",
  });

  const [seatCategories, setSeatCategories] = useState<any[]>([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const showRes = await api.get(`/shows/${id}`);
        const show = showRes.data.show;

        setForm({
          movie: show.movie,
          date: show.date?.slice(0, 10),
          time: show.time,
          screen: show.screen,
          language: show.language,
          format: show.format,
          maxSeatsPerBooking: show.maxSeatsPerBooking,
          weekendMultiplier: show.weekendMultiplier,
          status: show.status,
        });

        const formattedSeats = show.seatCategories.map((cat: any) => ({
          ...cat,
          rows: cat.rows.join(","),
        }));

        setSeatCategories(formattedSeats);

        const movieRes = await api.get("/movies");
        setMovies(movieRes.data.movies);

      } catch {
        toast.error("Failed to load show data");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSeatChange = (index: number, field: string, value: any) => {
    const updated = [...seatCategories];
    updated[index] = { ...updated[index], [field]: value };
    setSeatCategories(updated);
  };

  const addSeatCategory = () => {
    setSeatCategories([
      ...seatCategories,
      { type: "", price: 0, rows: "", seatsPerRow: 0 },
    ]);
  };

  const removeSeatCategory = (index: number) => {
    setSeatCategories(seatCategories.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formattedSeats = seatCategories.map((cat) => ({
        type: cat.type,
        price: Number(cat.price),
        rows: cat.rows.split(",").map((r: string) => r.trim().toUpperCase()),
        seatsPerRow: Number(cat.seatsPerRow),
      }));

      const basePrice = Math.min(...formattedSeats.map((c) => c.price));

      await api.put(`/shows/${id}`, {
        ...form,
        basePrice,
        seatCategories: formattedSeats,
      });

      toast.success("Show updated successfully 🎉");
      navigate("/admin/shows");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-14 px-6">
      <div
        className="p-12 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-color)",
        }}
      >
        <h1 className="text-4xl font-bold text-center mb-12">
          ✏ Edit Show
        </h1>

        <form onSubmit={handleUpdate} className="grid gap-12">

          {/* ================= BASIC INFORMATION ================= */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              🎬 Basic Information
            </h2>

            <div className="grid gap-6">

              <div>
                <label className="block mb-2 font-semibold">
                  Select Movie *
                </label>
                <select
                  name="movie"
                  value={form.movie}
                  onChange={handleChange}
                  required
                  className="p-3 rounded-lg w-full"
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-6">

                <div>
                  <label className="block mb-2 font-semibold">
                    Show Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Show Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Screen Number *
                  </label>
                  <input
                    type="number"
                    name="screen"
                    value={form.screen}
                    onChange={handleChange}
                    className="p-3 rounded-lg w-full"
                  />
                </div>

              </div>

              <div className="grid md:grid-cols-4 gap-6">

                <div>
                  <label className="block mb-2 font-semibold">
                    Language
                  </label>
                  <input
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Format
                  </label>
                  <input
                    name="format"
                    value={form.format}
                    onChange={handleChange}
                    className="p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Max Seats Per Booking
                  </label>
                  <input
                    type="number"
                    name="maxSeatsPerBooking"
                    value={form.maxSeatsPerBooking}
                    onChange={handleChange}
                    className="p-3 rounded-lg w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    Weekend Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weekendMultiplier"
                    value={form.weekendMultiplier}
                    onChange={handleChange}
                    className="p-3 rounded-lg w-full"
                  />
                </div>

              </div>

            </div>
          </div>

          {/* ================= SEAT CATEGORIES ================= */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              🎭 Seat Categories
            </h2>

            {seatCategories.map((cat, index) => (
              <div
                key={index}
                className="grid md:grid-cols-5 gap-4 mb-6 p-6 rounded-lg border"
              >
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Category Type
                  </label>
                  <input
                    value={cat.type}
                    onChange={(e) =>
                      handleSeatChange(index, "type", e.target.value)
                    }
                    className="p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={cat.price}
                    onChange={(e) =>
                      handleSeatChange(index, "price", e.target.value)
                    }
                    className="p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Rows (A,B,C)
                  </label>
                  <input
                    value={cat.rows}
                    onChange={(e) =>
                      handleSeatChange(index, "rows", e.target.value)
                    }
                    className="p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Seats Per Row
                  </label>
                  <input
                    type="number"
                    value={cat.seatsPerRow}
                    onChange={(e) =>
                      handleSeatChange(index, "seatsPerRow", e.target.value)
                    }
                    className="p-2 rounded w-full"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSeatCategory(index)}
                    className="bg-gray-500 text-white rounded px-3 py-2 w-full"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSeatCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Category
            </button>
          </div>

          {/* ================= STATUS ================= */}
          <div>
            <label className="block mb-2 font-semibold">
              Show Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="p-3 rounded-lg w-full"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700"
            >
              {loading ? "Updating..." : "Update Show"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/shows")}
              className="flex-1 py-4 rounded-xl text-white font-semibold bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}