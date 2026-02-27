// frontend/src/components/movie/MovieGrid.tsx

import MovieCard from "./MovieCard";
import type { Movie } from "../../types/movie";

interface Props {
  movies?: Movie[];
}

export default function MovieGrid({ movies = [] }: Props) {
  const validMovies = movies.filter(
    (movie) => movie && (movie._id || movie.id)
  );

  if (!validMovies.length) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        🎬 No movies available
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {validMovies.map((movie) => (
          <div
            key={movie._id || movie.id}
            className="transition-all duration-300 hover:-translate-y-2"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}