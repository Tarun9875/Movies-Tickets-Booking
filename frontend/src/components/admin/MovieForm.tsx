import { useState } from "react";
import api from "../../services/axios";

export default function MovieForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "",
    duration: "",
    rating: "",
    poster: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/admin/movies", {
        ...form,
        duration: Number(form.duration),
        rating: Number(form.rating)
      });

      alert("✅ Movie added successfully");
      window.location.reload();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding movie");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-red-600">
        Add New Movie
      </h2>

      <div className="grid gap-4">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="language"
          placeholder="Language"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="duration"
          placeholder="Duration (minutes)"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="rating"
          placeholder="Rating"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="poster"
          placeholder="Poster Image URL"
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Add Movie
        </button>
      </div>
    </div>
  );
}
