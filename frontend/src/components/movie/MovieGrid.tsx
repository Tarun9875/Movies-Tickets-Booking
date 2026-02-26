//frontend/src/components/movie/MovieGrid.tsx
import MovieCard from "./MovieCard";

interface Movie {
  id?: string;
  _id?: string;
  title: string;
  poster: string;
  rating: number;
}

interface Props {
  movies?: Movie[];
}

export default function MovieGrid({ movies = [] }: Props) {
  const validMovies = movies.filter(
    (movie) => movie && (movie.id || movie._id)
  );

  if (!validMovies.length) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400 transition-colors duration-300">
        🎬 No movies available
      </div>
    );
  }

  return (
    <div
      className="
        transition-colors duration-300
      "
    >
      <div
        className="
          grid gap-10
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
        "
      >
        {validMovies.map((movie) => (
          <div
            key={movie.id || movie._id}
            className="
              transition-all duration-300
              hover:-translate-y-2
            "
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
