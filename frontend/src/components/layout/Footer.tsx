import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{
        backgroundColor: "var(--card-bg)",
        color: "var(--text-color)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div
        className="
          max-w-7xl mx-auto px-6 py-12
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4
          gap-10
        "
      >
        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-red-600 mb-3">
            🎟️ MovieBook
          </h2>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto md:mx-0"
            style={{ color: "var(--muted-text)" }}
          >
            Book movie tickets online for the latest movies, theaters, and shows.
            Fast, secure, and easy booking experience.
          </p>
        </div>

        {/* Quick Links */}
        <FooterSection title="Quick Links">
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/movies">Movies</FooterLink>
          <FooterLink to="/my-bookings">My Bookings</FooterLink>
          <FooterLink to="/login">Login / Register</FooterLink>
        </FooterSection>

        {/* Support */}
        <FooterSection title="Support">
          <FooterLink to="/help">Help Center</FooterLink>
          <FooterLink to="/faq">FAQs</FooterLink>
          <FooterLink to="/terms">Terms & Conditions</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
        </FooterSection>

        {/* Contact */}
        <FooterSection title="Contact Us">
          <ul className="space-y-2 text-sm">
            <li>📍 India</li>
            <li>📧 support@moviebook.com</li>
            <li>📞 +91 98765 43210</li>
          </ul>
        </FooterSection>
      </div>

      <div
        className="text-center py-4 text-sm px-4"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        © {new Date().getFullYear()} MovieBook. All rights reserved.
      </div>
    </footer>
  );
}

/* Reusable Components */

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center md:text-left">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        to={to}
        className="transition-colors duration-200 hover:text-red-500"
      >
        {children}
      </Link>
    </li>
  );
}
