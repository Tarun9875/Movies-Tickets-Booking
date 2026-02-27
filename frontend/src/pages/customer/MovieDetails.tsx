// frontend/src/pages/customer/MovieDetails.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import type { Movie } from "../../types/movie";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  /* ================= FETCH MOVIE ================= */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data.movie);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load movie ❌"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="py-40 text-center text-lg">
          🎬 Loading movie details...
        </div>
      </PageContainer>
    );
  }

  if (!movie) {
    return (
      <PageContainer>
        <div className="py-40 text-center text-xl">
          🎬 Movie Not Found
        </div>
      </PageContainer>
    );
  }

  /* ================= IMAGE SYSTEM (posterUrl) ================= */
  const posterUrl =
    movie.posterUrl && movie.posterUrl.trim() !== ""
      ? movie.posterUrl
      : "/images/no-image.jpg";

  const getCastImage = (image?: string) => {
    if (!image || image.trim() === "") {
      return "/images/no-image.jpg";
    }
    return image;
  };

  /* ================= YOUTUBE EMBED ================= */
  const getEmbedUrl = (url?: string) => {
    if (!url) return "";

    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  };

  /* ================= BOOK BUTTON ================= */
  const handleBookNow = async () => {
    try {
      if (!user) {
        navigate("/login", {
          state: { redirectTo: `/movies/${movie._id}` },
        });
        return;
      }

      const res = await api.get(
        `/shows?movie=${movie._id}&status=ACTIVE`
      );

      const shows = res.data.shows;

      if (!shows || shows.length === 0) {
        toast.warning("No active shows available 🎬");
        return;
      }

      if (shows.length === 1) {
        navigate(`/shows/${shows[0]._id}/seats`);
      } else {
        navigate(`/movies/${movie._id}/shows`);
      }

    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load shows ❌"
      );
    }
  };

  return (
    <PageContainer>
      <section className="min-h-screen py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* POSTER */}
          <div className="flex justify-center">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full max-w-xl rounded-3xl shadow-2xl"
              style={{ border: "1px solid var(--border-color)" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/no-image.jpg";
              }}
            />
          </div>

          {/* DETAILS */}
          <div
            className="rounded-3xl p-12 shadow-xl"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h1 className="text-5xl font-bold mb-6">
              {movie.title}
            </h1>

            <p className="mb-8 text-lg opacity-80">
              {movie.description ?? "No description available."}
            </p>

            {movie.trailer && (
              <button
                onClick={() => setShowTrailer(true)}
                className="mb-8 px-6 py-3 rounded-xl text-white bg-black"
              >
                ▶ Watch Trailer
              </button>
            )}

            <div className="grid grid-cols-2 gap-6 mb-10">
              <p><strong>Language:</strong> {movie.language ?? "--"}</p>
              <p><strong>Duration:</strong> {movie.duration ?? "--"} min</p>
              <p><strong>Rating:</strong> {movie.rating ?? "N/A"}</p>
              <p><strong>Genre:</strong> {movie.genre ?? "--"}</p>
              <p>
                <strong>Release:</strong>{" "}
                {movie.releaseDate
                  ? movie.releaseDate.slice(0, 10)
                  : "--"}
              </p>
              <p><strong>Director:</strong> {movie.director ?? "--"}</p>
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Cast</h3>
                <div className="flex gap-6 overflow-x-auto">
                  {movie.cast.map((actor, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={getCastImage(actor.image)}
                        alt={actor.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/no-image.jpg";
                        }}
                      />
                      <p className="mt-2 font-semibold">
                        {actor.name}
                      </p>
                      <p className="text-xs opacity-70">
                        {actor.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleBookNow}
              className="w-full py-4 rounded-2xl text-white font-semibold text-lg"
              style={{
                background:
                  "linear-gradient(to right, #dc2626, #ec4899)",
              }}
            >
              🎟 Book Tickets
            </button>
          </div>
        </div>

        {/* TRAILER MODAL */}
        {showTrailer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative w-[90%] md:w-[800px] aspect-video bg-black rounded-xl">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-3 right-3 bg-white px-3 py-1 rounded"
              >
                ✕
              </button>
              <iframe
                src={getEmbedUrl(movie.trailer)}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  );
}