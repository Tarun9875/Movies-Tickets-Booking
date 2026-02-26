// frontend/src/pages/customer/Payment.tsx

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";

export default function Payment() {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    movieTitle,
    selectedSeats,
    selectedDate,
    selectedTime,
    selectedLanguage,
    totalPrice,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);

  if (!movieTitle) {
    navigate("/");
    return null;
  }

  const convenienceFee = 40;
  const gst = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + convenienceFee + gst;

  const handlePayment = () => {
    setProcessing(true);

    setTimeout(() => {
      const bookingId = "MB" + Math.floor(Math.random() * 1000000);
      navigate(`/my-bookings/${bookingId}`, {
        state: {
          bookingId,
          movieTitle,
          selectedSeats,
          selectedDate,
          selectedTime,
          selectedLanguage,
          grandTotal,
        },
      });
    }, 2000);
  };

  return (
    <PageContainer>
      <div
        className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        {/* Booking Summary */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-6"
            style={{ color: "var(--text-color)" }}
          >
            🎟 Booking Summary
          </h2>

          <p style={{ color: "var(--muted-text)" }}>
            Movie: {movieTitle}
          </p>
          <p style={{ color: "var(--muted-text)" }}>
            Date: {selectedDate}
          </p>
          <p style={{ color: "var(--muted-text)" }}>
            Time: {selectedTime}
          </p>
          <p style={{ color: "var(--muted-text)" }}>
            Language: {selectedLanguage}
          </p>
          <p style={{ color: "var(--muted-text)" }}>
            Seats: {selectedSeats.join(", ")}
          </p>

          <hr className="my-4" />

          <p>Seat Total: ₹{totalPrice}</p>
          <p>Convenience Fee: ₹{convenienceFee}</p>
          <p>GST (18%): ₹{gst}</p>

          <h3 className="mt-4 text-lg font-bold">
            Grand Total: ₹{grandTotal}
          </h3>
        </div>

        {/* Payment Section */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-6"
            style={{ color: "var(--text-color)" }}
          >
            💳 Secure Payment
          </h2>

          {/* Payment Options */}
          <div className="space-y-4 mb-6">
            <button
              onClick={() => setPaymentMethod("UPI")}
              className={`w-full py-3 rounded-lg ${
                paymentMethod === "UPI"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Pay via UPI
            </button>

            <button
              onClick={() => setPaymentMethod("CARD")}
              className={`w-full py-3 rounded-lg ${
                paymentMethod === "CARD"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Pay via Card
            </button>
          </div>

          {/* Dummy Inputs */}
          {paymentMethod === "UPI" && (
            <input
              placeholder="Enter UPI ID"
              className="w-full p-3 rounded-lg border mb-4"
            />
          )}

          {paymentMethod === "CARD" && (
            <>
              <input
                placeholder="Card Number"
                className="w-full p-3 rounded-lg border mb-3"
              />
              <div className="flex gap-3">
                <input
                  placeholder="MM/YY"
                  className="w-1/2 p-3 rounded-lg border"
                />
                <input
                  placeholder="CVV"
                  className="w-1/2 p-3 rounded-lg border"
                />
              </div>
            </>
          )}

          <button
            onClick={handlePayment}
            disabled={processing}
            className="mt-6 w-full py-3 rounded-lg text-white bg-red-600 hover:bg-red-700"
          >
            {processing ? "Processing..." : `Pay ₹${grandTotal}`}
          </button>

          <p className="mt-4 text-xs text-center opacity-60">
            🔐 100% Secure Checkout
          </p>
        </div>
      </div>
    </PageContainer>
  );
}