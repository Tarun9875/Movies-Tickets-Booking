// frontend/src/pages/admin/EditMovie.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { toast } from "react-toastify";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    language: "",
    rating: "",
    releaseDate: "",
    status: "NOW_SHOWING",
    posterUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ================= FETCH MOVIE ================= */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const movie = res.data.movie;

        setForm({
          title: movie.title || "",
          description: movie.description || "",
          duration: movie.duration?.toString() || "",
          language: movie.language || "",
          rating: movie.rating?.toString() || "",
          releaseDate: movie.releaseDate
            ? movie.releaseDate.split("T")[0]
            : "",
          status: movie.status || "NOW_SHOWING",
          posterUrl: movie.posterUrl || "",
        });
      } catch {
        toast.error("Failed to load movie");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value ?? "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Movie title is required");
      return false;
    }

    if (!form.language.trim()) {
      toast.error("Language is required");
      return false;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      toast.error("Valid duration is required");
      return false;
    }

    if (!form.posterUrl.trim()) {
      toast.error("Poster image path is required");
      return false;
    }

    return true;
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        duration: Number(form.duration),
        language: form.language.trim(),
        rating: form.rating ? Number(form.rating) : undefined,
        releaseDate: form.releaseDate || undefined,
        status: form.status,
        posterUrl: form.posterUrl.trim(),
      };

      await api.put(`/movies/${id}`, payload);

      toast.success("Movie updated successfully 🎉");
      navigate("/admin/movies");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-center mt-10">Loading movie...</p>;
  }

  return (
    <div
      className="max-w-4xl mx-auto p-8 rounded-xl shadow-xl"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        color: "var(--text-color)",
      }}
    >
      <h1 className="text-3xl font-bold mb-8">✏ Edit Movie</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold">
            Movie Title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Avengers Endgame"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>

        {/* Language */}
        <div>
          <label className="block mb-2 font-semibold">
            Language *
          </label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="English / Hindi"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-2 font-semibold">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="150"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-2 font-semibold">
            Rating (0 - 10)
          </label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            placeholder="8.5"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>

        {/* Release Date */}
        <div>
          <label className="block mb-2 font-semibold">
            Release Date
          </label>
          <input
            type="date"
            name="releaseDate"
            value={form.releaseDate}
            onChange={handleChange}
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-semibold">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          >
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
        </div>

        {/* Poster URL */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">
            Poster Image Path *
          </label>
          <input
            name="posterUrl"
            value={form.posterUrl}
            onChange={handleChange}
            placeholder="/images/wp5115631.jpg"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
          <p className="text-sm mt-1 opacity-70">
            Image must be inside public/images/
          </p>
        </div>

        {/* Poster Preview */}
        {form.posterUrl && (
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              Poster Preview
            </label>
            <img
              src={form.posterUrl}
              alt="Poster Preview"
              className="h-60 rounded-lg shadow-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/no-image.jpg";
              }}
            />
          </div>
        )}

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Write movie description..."
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
          />
        </div>

      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="button"
          onClick={() => navigate("/admin/movies")}
          className="flex-1 py-3 rounded-lg"
          style={{ backgroundColor: "var(--border-color)" }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="flex-1 py-3 rounded-lg text-white"
          style={{ backgroundColor: "#dc2626" }}
        >
          {loading ? "Updating..." : "Update Movie"}
        </button>
      </div>
    </div>
  );
}