import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axios";

export default function AddShow() {
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

  const [seatCategories, setSeatCategories] = useState([
    { type: "VIP", price: 500, rows: "L", seatsPerRow: 14 },
    { type: "PREMIUM", price: 350, rows: "K,J,I", seatsPerRow: 20 },
    { type: "EXECUTIVE", price: 250, rows: "H,G,F,E", seatsPerRow: 20 },
    { type: "NORMAL", price: 200, rows: "D,C,B,A", seatsPerRow: 18 },
  ]);

  // ================= FETCH MOVIES =================
  useEffect(() => {
    api.get("/movies").then((res) => {
      setMovies(res.data.movies);
    });
  }, []);

  // ================= HANDLE BASIC FORM =================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= HANDLE SEAT CATEGORY =================
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
    const updated = seatCategories.filter((_, i) => i !== index);
    setSeatCategories(updated);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formattedSeats = seatCategories.map((cat) => ({
        type: cat.type,
        price: Number(cat.price),
        rows: cat.rows.split(",").map((r) => r.trim().toUpperCase()),
        seatsPerRow: Number(cat.seatsPerRow),
      }));

      await api.post("/shows", {
        ...form,
        seatCategories: formattedSeats,
      });

      toast.success("Show created successfully 🎉");
      navigate("/admin/shows");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating show");
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
          🎟 Create Advanced Show
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-10">

          {/* ================= BASIC INFO ================= */}
          <div className="grid gap-6">
            <label className="font-semibold">Select Movie *</label>
            <select
              name="movie"
              value={form.movie}
              onChange={handleChange}
              required
              className="p-3 rounded-lg"
            >
              <option value="">Choose Movie</option>
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-semibold">Date *</label>
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
              <label className="font-semibold">Time *</label>
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
              <label className="font-semibold">Screen *</label>
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
              <label className="font-semibold">Language</label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="p-3 rounded-lg w-full"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>IMAX</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Format</label>
              <select
                name="format"
                value={form.format}
                onChange={handleChange}
                className="p-3 rounded-lg w-full"
              >
                <option>2D</option>
                <option>3D</option>
                <option>IMAX</option>
                <option>Dolby</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Max Seats Per Booking</label>
              <input
                type="number"
                name="maxSeatsPerBooking"
                value={form.maxSeatsPerBooking}
                onChange={handleChange}
                className="p-3 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="font-semibold">Weekend Multiplier</label>
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

          {/* ================= SEAT CATEGORIES ================= */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              🎭 Seat Categories
            </h2>

            {seatCategories.map((cat, index) => (
              <div
                key={index}
                className="grid md:grid-cols-5 gap-4 mb-6 p-5 rounded-lg border"
              >
                <input
                  value={cat.type}
                  onChange={(e) =>
                    handleSeatChange(index, "type", e.target.value)
                  }
                  placeholder="Type (VIP)"
                  className="p-2 rounded"
                />

                <input
                  type="number"
                  value={cat.price}
                  onChange={(e) =>
                    handleSeatChange(index, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="p-2 rounded"
                />

                <input
                  value={cat.rows}
                  onChange={(e) =>
                    handleSeatChange(index, "rows", e.target.value)
                  }
                  placeholder="Rows (A,B,C)"
                  className="p-2 rounded"
                />

                <input
                  type="number"
                  value={cat.seatsPerRow}
                  onChange={(e) =>
                    handleSeatChange(index, "seatsPerRow", e.target.value)
                  }
                  placeholder="Seats per Row"
                  className="p-2 rounded"
                />

                <button
                  type="button"
                  onClick={() => removeSeatCategory(index)}
                  className="bg-gray-500 text-white rounded px-3"
                >
                  Remove
                </button>
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
            <label className="font-semibold">Status</label>
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
          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 rounded-xl text-white font-semibold bg-red-600 hover:bg-red-700"
            >
              {loading ? "Creating..." : "Create Show"}
            </button>

            {/* ✅ Cancel Button */}
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