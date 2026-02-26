import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import api, { BASE_URL } from "../../services/axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [movie, setMovie] = useState<any>(null);
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <PageContainer>
        <div className="py-40 text-center text-lg">
          🎬 Loading movie details...
        </div>
      </PageContainer>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!movie) {
    return (
      <PageContainer>
        <div className="py-40 text-center text-xl">
          🎬 Movie Not Found
        </div>
      </PageContainer>
    );
  }

  /* ================= IMAGE FIX ================= */
  const posterUrl = movie.poster?.startsWith("http")
    ? movie.poster
    : `${BASE_URL}${movie.poster}`;

  /* ================= CAST IMAGE FIX ================= */
  const getCastImage = (image: string) => {
    if (!image) return "https://via.placeholder.com/150?text=No+Image";
    return image.startsWith("http")
      ? image
      : `${BASE_URL}${image}`;
  };

  /* ================= YOUTUBE EMBED FIX ================= */
  const getEmbedUrl = (url: string) => {
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
  const handleBookNow = () => {
    if (!user) {
      navigate("/login", {
        state: { redirectTo: `/movies/${movie._id}/shows` },
      });
    } else {
      navigate(`/movies/${movie._id}/shows`);
    }
  };

  return (
    <PageContainer>
      <section className="min-h-screen py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* ================= POSTER ================= */}
          <div className="flex justify-center group">
            <div className="relative w-full max-w-xl transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-3">

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/30 via-pink-500/20 to-orange-400/30 blur-3xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <img
                src={posterUrl}
                alt={movie.title}
                className="relative w-full rounded-3xl shadow-2xl border transition-all duration-500 group-hover:shadow-red-500/40"
                style={{ borderColor: "var(--border-color)" }}
                onError={(e: any) => {
                  e.target.src =
                    "https://via.placeholder.com/500x750?text=No+Image";
                }}
              />
            </div>
          </div>

          {/* ================= DETAILS ================= */}
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

            <p
              className="mb-8 leading-relaxed text-lg"
              style={{ color: "var(--muted-text)" }}
            >
              {movie.description}
            </p>

            {/* Trailer Button */}
            {movie.trailer && (
              <button
                onClick={() => setShowTrailer(true)}
                className="mb-8 px-6 py-3 rounded-xl text-white bg-black hover:opacity-80 transition"
              >
                ▶ Watch Trailer
              </button>
            )}

            {/* Movie Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-base">
              <p><strong>🎥 Language:</strong> {movie.language}</p>
              <p><strong>⏱ Duration:</strong> {movie.duration} min</p>
              <p><strong>⭐ Rating:</strong> {movie.rating}</p>
              <p><strong>🎭 Genre:</strong> {movie.genre}</p>
              <p>
                <strong>📅 Release:</strong>{" "}
                {movie.releaseDate?.slice(0, 10)}
              </p>
              <p><strong>🎬 Director:</strong> {movie.director}</p>
            </div>

            {/* ================= CAST ================= */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  👥 Cast
                </h3>

                <div className="flex gap-6 overflow-x-auto pb-2">
                  {movie.cast.map((actor: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center min-w-[120px] hover:scale-105 transition duration-300"
                    >
                      <img
                        src={getCastImage(actor.image)}
                        alt={actor.name}
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                        style={{
                          border: "2px solid var(--border-color)",
                        }}
                      />
                      <p className="mt-2 text-sm font-semibold text-center">
                        {actor.name}
                      </p>
                      <p
                        className="text-xs text-center"
                        style={{ color: "var(--muted-text)" }}
                      >
                        {actor.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= BOOK ================= */}
            <button
              onClick={handleBookNow}
              className="mt-10 w-full py-4 rounded-2xl font-semibold text-lg text-white bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-300"
            >
              🎟 Book Tickets
            </button>
          </div>
        </div>

        {/* ================= TRAILER MODAL ================= */}
        {showTrailer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="relative w-[90%] md:w-[800px] aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-3 right-3 bg-white px-3 py-1 rounded-md shadow"
              >
                ✕
              </button>

              <iframe
                src={getEmbedUrl(movie.trailer)}
                title="Trailer"
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