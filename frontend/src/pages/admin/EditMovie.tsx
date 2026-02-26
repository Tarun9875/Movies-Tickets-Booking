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
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ================= FETCH MOVIE =================
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const movie = res.data.movie;

        setForm({
          title: movie.title || "",
          description: movie.description || "",
          duration: movie.duration || "",
          language: movie.language || "",
          rating: movie.rating || "",
          releaseDate: movie.releaseDate
            ? movie.releaseDate.split("T")[0]
            : "",
          status: movie.status || "NOW_SHOWING",
        });

        if (movie.poster) {
          setPreview(`http://localhost:5000${movie.poster}`);
        }
      } catch {
        toast.error("Failed to load movie");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= POSTER CHANGE =================
  const handlePosterChange = (file: File | null) => {
    if (!file) return;
    setPoster(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!form.title || !form.language || !form.duration) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      if (poster) formData.append("poster", poster);

      await api.put(`/movies/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie updated successfully 🎉");
      navigate("/admin/movies");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
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
      <h1 className="text-3xl font-bold mb-6">
        ✏ Edit Movie
      </h1>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          name="title"
          value={form.title}
          placeholder="Movie Title *"
          className="p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        />

        <input
          name="language"
          value={form.language}
          placeholder="Language *"
          className="p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        />

        <input
          name="duration"
          value={form.duration}
          placeholder="Duration (min) *"
          className="p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        />

        <input
          name="rating"
          value={form.rating}
          placeholder="Rating (e.g. 8.5)"
          className="p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        />

        <input
          type="date"
          name="releaseDate"
          value={form.releaseDate}
          className="p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          className="p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        >
          <option value="NOW_SHOWING">Now Showing</option>
          <option value="UPCOMING">Upcoming</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          placeholder="Description"
          className="md:col-span-2 p-3 rounded-lg"
          style={{ backgroundColor: "var(--input-bg)" }}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handlePosterChange(e.target.files?.[0] || null)
            }
          />
        </div>

        {preview && (
          <div className="md:col-span-2">
            <img
              src={preview}
              alt="Poster Preview"
              className="h-60 rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate("/admin/movies")}
          className="flex-1 py-3 rounded-lg"
          style={{
            backgroundColor: "var(--border-color)",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="flex-1 py-3 rounded-lg text-white"
          style={{
            backgroundColor: "#dc2626",
          }}
        >
          {loading ? "Updating..." : "Update Movie"}
        </button>
      </div>
    </div>
  );
}