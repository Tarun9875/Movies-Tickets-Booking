import { useNavigate } from "react-router-dom";

const featuredMovies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  },
  {
    id: 2,
    title: "Inception",
    poster:
      "https://image.tmdb.org/t/p/w500/8s4h9friP6Ci3adRGahHARVd76E.jpg",
  },
  {
    id: 3,
    title: "Jawan",
    poster:
      "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
  },
  
];

export default function HeroSlider() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-[70vh] flex items-center overflow-hidden"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "linear-gradient(to right, var(--bg-color), transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <span
            className="inline-block px-4 py-1 mb-4 text-sm rounded-full font-medium"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            🎬 Now Streaming Online
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Book Movie Tickets <br /> Anytime, Anywhere 🎟️
          </h1>

          <p
            className="mt-4 text-lg max-w-xl"
            style={{ color: "var(--muted-text)" }}
          >
            Real-time seat booking • Best offers • Secure payments
          </p>

          <button
            onClick={() => navigate("/movies")}
            className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg text-white font-semibold shadow-lg"
          >
            Explore Movies
          </button>
        </div>

        {/* Right Posters */}
        <div className="grid grid-cols-3 gap-4">
          {featuredMovies.map((movie) => (
            <div
              key={movie.id}
              className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-60 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
