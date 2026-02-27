// frontend/src/components/sliders/MovieSlider.tsx

import { useEffect, useState } from "react";
import api from "../../services/axios";
import MovieGrid from "../movie/MovieGrid";
import  type { Movie } from "../../types/movie"; // ✅ USE SHARED TYPE

export default function MovieSlider() {
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get("/movies");

        const movies: Movie[] = res.data.movies || [];

        setNowShowing(
          movies.filter(
            (movie) => movie.status === "NOW_SHOWING"
          )
        );

        setUpcoming(
          movies.filter(
            (movie) => movie.status === "UPCOMING"
          )
        );
      } catch (error) {
        console.error("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-lg">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">

      {/* NOW SHOWING */}
      {nowShowing.length > 0 && (
        <section>
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: "var(--text-color)" }}
          >
            🎬 Now Showing
          </h2>

          <MovieGrid movies={nowShowing} />
        </section>
      )}

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <section>
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: "var(--text-color)" }}
          >
            🎥 Upcoming Movies
          </h2>

          <MovieGrid movies={upcoming} />
        </section>
      )}

    </div>
  );
}