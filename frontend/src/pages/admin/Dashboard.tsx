import { useEffect, useState } from "react";
import api from "../../services/axios";
import MovieForm from "../../components/admin/MovieForm";

interface Movie {
  _id: string;
  title: string;
  language: string;
  rating: number;
}

export default function AdminDashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchMovies = async () => {
    const res = await api.get("/movies");
    setMovies(res.data.movies);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Card title="Total Revenue" value="$45,231.89" />
          <Card title="Active Users" value="2,350" />
          <Card title="Total Movies" value={movies.length.toString()} />
          <Card title="Conversion Rate" value="3.42%" />
        </div>
      </div>

      {/* Movie Management */}
      <div
        className="
          p-6 rounded-xl shadow-sm
          border
          bg-[var(--card-bg)]
          border-[var(--border-color)]
        "
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--primary-color)]">
            🎬 Movie Management
          </h2>

          {/* button removed Becuse not required */}
          
        </div>

        {/* Add Movie Form */}
        {showForm && (
          <div className="mb-6">
            <MovieForm />
          </div>
        )}

        {/* Movie List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="
                p-4 rounded-lg border
                border-[var(--border-color)]
                bg-[var(--card-bg)]
                hover:shadow-md
                transition
              "
            >
              <h3 className="font-semibold text-lg">
                {movie.title}
              </h3>

              <p className="text-sm opacity-70">
                {movie.language} | ⭐ {movie.rating}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="
        p-6 rounded-xl shadow-sm
        border
        bg-[var(--card-bg)]
        border-[var(--border-color)]
        transition-colors duration-300
        hover:shadow-lg
      "
    >
      <p className="text-sm opacity-70">
        {title}
      </p>

      <h2
        className="
          text-2xl font-bold mt-2
          text-[var(--primary-color)]
        "
      >
        {value}
      </h2>
    </div>
  );
}
