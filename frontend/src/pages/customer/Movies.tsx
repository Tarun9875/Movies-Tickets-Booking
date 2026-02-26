// frontend/src/pages/customer/Movies.tsx

import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import MovieGrid from "../../components/movie/MovieGrid";
import api from "../../services/axios";
import { toast } from "react-toastify";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH MOVIES =================
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get("/movies");
        setMovies(res.data.movies || []);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load movies ❌"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <PageContainer>
      <section
        className="
        relative
        px-6 py-20 
        max-w-7xl mx-auto
      "
      >
        {/* Background Glow Effect */}
        <div
          className="
          absolute top-0 left-1/2 -translate-x-1/2
          w-[500px] h-[300px]
          bg-red-500/10
          blur-3xl
          rounded-full
          -z-10
        "
        />

        {/* Header */}
        <div className="mb-16 text-center animate-fade-in">

          <div
            className="
            inline-flex items-center gap-3 
            bg-red-100 dark:bg-red-900/40
            px-5 py-2 rounded-full
            shadow-sm
            mb-6
          "
          >
            <span className="text-2xl">🎬</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              Cinema Collection
            </span>
          </div>

          <h1
            className="
            text-5xl md:text-6xl font-extrabold
            bg-gradient-to-r from-red-600 via-pink-500 to-orange-400
            bg-clip-text text-transparent
            tracking-tight
          "
          >
            All Movies
          </h1>

          <div
            className="
            w-32 h-1 mx-auto mt-6
            bg-gradient-to-r from-red-600 to-pink-500
            rounded-full
            animate-pulse
          "
          />

          <p
            className="
            mt-8 text-lg
            text-gray-600 dark:text-gray-400
            max-w-2xl mx-auto
            leading-relaxed
          "
          >
            Discover trending blockbusters, upcoming releases,
            and timeless classics. Book your favorite movie and
            enjoy a cinematic experience like never before.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading movies...
          </div>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </section>
    </PageContainer>
  );
}