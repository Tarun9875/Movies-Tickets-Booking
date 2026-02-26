import PageContainer from "../../components/layout/PageContainer";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function About() {

  const handleExplore = () => {
    toast.success("Welcome to MovieBook 🎬✨");
  };

  return (
    <PageContainer>
      <div className="min-h-screen py-16 px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >

          <h1 className="text-4xl font-bold mb-6 text-center"
              style={{ color: "var(--text-color)" }}>
            🎬 About MovieBook
          </h1>

          <p className="text-center mb-12"
             style={{ color: "var(--muted-text)" }}>
            Seamless ticket booking experience built for movie lovers.
          </p>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="about-card">
              <h2>🎟 Easy Booking</h2>
              <p>
                Book tickets in seconds with real-time seat selection.
              </p>
            </div>

            <div className="about-card">
              <h2>🏢 Premium Experience</h2>
              <p>
                Enjoy immersive theatre environment with modern seating.
              </p>
            </div>

            <div className="about-card">
              <h2>⚡ Fast & Secure</h2>
              <p>
                Secure payments and instant confirmations.
              </p>
            </div>

            <div className="about-card">
              <h2>🌍 Our Mission</h2>
              <p>
                Making movie booking effortless and enjoyable.
              </p>
            </div>

          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg"
            >
              Explore Movies
            </motion.button>
          </div>

        </motion.div>
      </div>
    </PageContainer>
  );
}