// frontend/src/components/movie/MovieCard.tsx

import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { BASE_URL } from "../../services/axios";

interface MovieProps {
  movie: any;
}

export default function MovieCard({ movie }: MovieProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  if (!movie) return null;

  // 🔥 Fix ID issue (MongoDB uses _id)
  const movieId = movie._id || movie.id;

  // 🔥 Fix image path
  const imageUrl = movie.poster
    ? movie.poster.startsWith("http")
      ? movie.poster
      : `${BASE_URL}${movie.poster}`
    : "/no-image.png";

  const handleBookNow = () => {
    if (movie.status !== "NOW_SHOWING") return;

    if (!user) {
      navigate("/login", {
        state: { redirectTo: `/movies/${movieId}` },
      });
    } else {
      navigate(`/movies/${movieId}`);
    }
  };

  return (
    <div
      className="
        group flex flex-col
        rounded-2xl overflow-hidden
        shadow-md hover:shadow-2xl
        hover:-translate-y-2
        transition-all duration-300
      "
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* CLICKABLE AREA */}
      <Link to={`/movies/${movieId}`} className="block">
        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={movie.title}
            className="
              h-72 w-full object-cover
              group-hover:scale-110
              transition duration-500
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-black/60 via-transparent to-transparent
              opacity-0 group-hover:opacity-100
              transition duration-300
            "
          />
        </div>

        {/* Movie Info */}
        <div className="p-5">
          <h2
            className="
              text-lg font-semibold
              group-hover:text-red-500
              transition
            "
            style={{ color: "var(--text-color)" }}
          >
            {movie.title}
          </h2>

          <p
            className="text-sm mt-1"
            style={{ color: "var(--muted-text)" }}
          >
            {movie.language} • {movie.duration} min
          </p>
        </div>
      </Link>

      {/* Bottom Section */}
      <div className="px-5 pb-5 mt-auto">

        {/* Status + Rating */}
        <div className="flex justify-between items-center mb-4">

          <span
            className="px-3 py-1 text-xs rounded-full font-medium"
            style={{
              backgroundColor:
                movie.status === "NOW_SHOWING"
                  ? "#16a34a20"
                  : "#ca8a0420",
              color:
                movie.status === "NOW_SHOWING"
                  ? "#16a34a"
                  : "#ca8a04",
            }}
          >
            {movie.status === "NOW_SHOWING"
              ? "Now Showing"
              : "Upcoming"}
          </span>

          <span
            className="
              px-3 py-1 text-xs rounded-full
              font-semibold bg-yellow-400 text-black
              shadow-md
            "
          >
            ⭐ {movie.rating || "N/A"}
          </span>

        </div>

        {/* Book Button */}
        <button
          onClick={handleBookNow}
          disabled={movie.status !== "NOW_SHOWING"}
          className={`
            w-full py-2 rounded-lg font-semibold text-white
            transition-all duration-300
            ${
              movie.status === "NOW_SHOWING"
                ? "bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          {movie.status === "NOW_SHOWING"
            ? "Book Now"
            : "Coming Soon"}
        </button>

      </div>
    </div>
  );
}