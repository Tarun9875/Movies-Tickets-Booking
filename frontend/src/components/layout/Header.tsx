// frontend/src/components/layout/Header.tsx

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../common/ThemeToggle";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-lg shadow-md transition-colors"
      style={{
        backgroundColor: "var(--card-bg)",
        color: "var(--text-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-red-600 tracking-wide"
        >
          🎟️ MovieBook
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">

          <NavLinks currentPath={location.pathname} />

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg transition"
              style={{
                backgroundColor: "var(--border-color)",
                color: "var(--text-color)",
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Login
            </Link>
          )}

          <ThemeToggle />
        </nav>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          className="md:hidden text-2xl"
          style={{ color: "var(--text-color)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div
          className="md:hidden border-t animate-fadeIn"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <nav className="flex flex-col px-6 py-4 gap-4 text-sm font-medium">

            <NavLinks
              currentPath={location.pathname}
              onClick={() => setOpen(false)}
            />

            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg transition"
                style={{
                  backgroundColor: "var(--border-color)",
                  color: "var(--text-color)",
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-center"
              >
                Login
              </Link>
            )}

            <ThemeToggle />
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLinks({
  onClick,
  currentPath,
}: {
  onClick?: () => void;
  currentPath: string;
}) {
  const linkStyle = (path: string) =>
    `transition hover:text-red-500 ${
      currentPath === path ? "text-red-600 font-semibold" : ""
    }`;

  return (
    <>
      <Link to="/" onClick={onClick} className={linkStyle("/")}>
        Home
      </Link>

      <Link to="/movies" onClick={onClick} className={linkStyle("/movies")}>
        Movies
      </Link>

      <Link
        to="/my-bookings"
        onClick={onClick}
        className={linkStyle("/my-bookings")}
      >
        My Bookings
      </Link>
      <Link
        to="/contact"
        onClick={onClick} 
        className={linkStyle("/contact")}
      >
        Contact
      </Link>
      <Link
        to="/about"
        onClick={onClick} 
        className={linkStyle("/about")}
      >
        About
      </Link>
    </>
  );
}