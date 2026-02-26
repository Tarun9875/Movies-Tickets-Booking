import { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Contact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error("Please fill all fields ❌");
      return;
    }

    toast.success("Message sent successfully 🎉");

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <PageContainer>
      <div className="min-h-screen py-16 px-6">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto"
        >

          <h1 className="text-4xl font-bold mb-6 text-center"
              style={{ color: "var(--text-color)" }}>
            📞 Contact Us
          </h1>

          <p className="text-center mb-12"
             style={{ color: "var(--muted-text)" }}>
            We'd love to hear from you. Send us your message!
          </p>

          <div className="grid md:grid-cols-2 gap-10">

            {/* INFO CARD */}
            <div className="contact-card">
              <h2>Get in Touch</h2>
              <p>📍 Ruchu Cinemas, Surat</p>
              <p>📧 support@moviebook.com</p>
              <p>📱 +91 98765 43210</p>
              <p>⏰ 9 AM - 11 PM</p>
            </div>

            {/* FORM CARD */}
            <form onSubmit={handleSubmit} className="contact-card space-y-4">

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="contact-input"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="contact-input"
              />

              <textarea
                placeholder="Your Message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="contact-input"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg"
              >
                Send Message
              </motion.button>

            </form>

          </div>

        </motion.div>
      </div>
    </PageContainer>
  );
}