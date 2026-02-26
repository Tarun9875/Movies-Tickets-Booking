// src/pages/admin/MovieDetail.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/axios";

interface CastMember {
  name: string;
  role: string;
  image: File | null;
  preview?: string;
}

export default function AdminMovieDetailForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ GET MOVIE ID

  const [form, setForm] = useState({
    trailer: "",
    genre: "",
    director: "",
  });

  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= HANDLE BASIC FIELDS =================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= CAST HANDLING =================
  const addCastMember = () => {
    setCast([...cast, { name: "", role: "", image: null }]);
  };

  const removeCastMember = (index: number) => {
    const updated = [...cast];
    updated.splice(index, 1);
    setCast(updated);
  };

  const handleCastChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...cast];
    (updated[index] as any)[field] = value;
    setCast(updated);
  };

  const handleCastImage = (index: number, file: File | null) => {
    if (!file) return;

    const updated = [...cast];
    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);
    setCast(updated);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!id) {
      toast.error("Movie ID missing");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("trailer", form.trailer);
      formData.append("genre", form.genre);
      formData.append("director", form.director);

      // Append cast JSON (name + role only)
      const castData = cast.map((c) => ({
        name: c.name,
        role: c.role,
      }));

      formData.append("cast", JSON.stringify(castData));

      // ✅ IMPORTANT: Use SAME field name as backend
      cast.forEach((c) => {
        if (c.image) {
          formData.append("castImages", c.image);
        }
      });

      // ✅ FIXED API URL
      await api.post(`/movies/${id}/details`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie details added successfully 🎉");
      navigate("/admin/movies");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add movie details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto p-8 rounded-xl shadow-xl"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        color: "var(--text-color)",
      }}
    >
      <h1 className="text-3xl font-bold mb-8">
        🎬 Add Movie Details
      </h1>

      {/* BASIC FIELDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">
            Trailer URL
          </label>
          <input
            name="trailer"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Genre
          </label>
          <input
            name="genre"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Director
          </label>
          <input
            name="director"
            className="w-full p-3 rounded-lg"
            style={{ backgroundColor: "var(--input-bg)" }}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* CAST SECTION */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">
          👥 Cast Members
        </h2>

        {cast.map((member, index) => (
          <div
            key={index}
            className="grid md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg"
            style={{ borderColor: "var(--border-color)" }}
          >
            <input
              placeholder="Actor Name"
              className="p-2 rounded"
              onChange={(e) =>
                handleCastChange(index, "name", e.target.value)
              }
            />

            <input
              placeholder="Role"
              className="p-2 rounded"
              onChange={(e) =>
                handleCastChange(index, "role", e.target.value)
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleCastImage(index, e.target.files?.[0] || null)
              }
            />

            <button
              type="button"
              onClick={() => removeCastMember(index)}
              className="bg-red-600 text-white rounded px-3"
            >
              Remove
            </button>

            {member.preview && (
              <img
                src={member.preview}
                className="h-20 mt-2 rounded"
              />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addCastMember}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Cast
        </button>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={() => navigate("/admin/movies")}
          className="flex-1 py-3 rounded bg-gray-500 text-white"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 rounded bg-red-600 text-white"
        >
          {loading ? "Saving..." : "Save Details"}
        </button>
      </div>
    </div>
  );
}