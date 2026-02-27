// frontend/src/pages/customer/Payment.tsx

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { useAppSelector } from "../../app/hooks";
import api from "../../services/axios";
import { toast } from "react-toastify";

export default function Payment() {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const bookingData = location.state;

  const [ready, setReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD">("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  /* ================= SAFE PAGE LOAD ================= */
  useEffect(() => {
    if (!bookingData) {
      navigate("/");
    } else {
      setReady(true);
    }
  }, [bookingData, navigate]);

  if (!ready) return null;

  const {
    movieTitle,
    selectedSeats = [],
    selectedDate,
    selectedTime,
    selectedLanguage,
    totalPrice = 0,
  } = bookingData;

  const convenienceFee = 40;
  const gst = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + convenienceFee + gst;

  /* ================= HANDLE PAYMENT ================= */
  const handlePayment = async () => {
    try {
      if (!user) {
        toast.warning("Please login first");
        navigate("/login");
        return;
      }

      if (paymentMethod === "UPI" && !upiId.trim()) {
        toast.error("Enter UPI ID");
        return;
      }

      if (
        paymentMethod === "CARD" &&
        (!cardNumber.trim() || !expiry.trim() || !cvv.trim())
      ) {
        toast.error("Fill all card details");
        return;
      }

      setProcessing(true);

      const res = await api.post("/bookings", {
        showId,
        seats: selectedSeats,
        paymentMethod,
      });

      toast.success("Booking Confirmed 🎉");

      navigate(`/my-bookings/${res.data.booking._id}`, {
        state: res.data.booking,
      });

    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Payment failed ❌"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* BOOKING SUMMARY */}
        <div className="rounded-xl p-6 border shadow-md">
          <h2 className="text-xl font-semibold mb-6">
            🎟 Booking Summary
          </h2>

          {user && (
            <>
              <p><strong>User:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <hr className="my-4" />
            </>
          )}

          <p>Movie: {movieTitle}</p>
          <p>Date: {selectedDate}</p>
          <p>Time: {selectedTime}</p>
          <p>Language: {selectedLanguage}</p>
          <p>Seats: {selectedSeats.join(", ")}</p>

          <hr className="my-4" />

          <p>Seat Total: ₹{totalPrice}</p>
          <p>Convenience Fee: ₹{convenienceFee}</p>
          <p>GST: ₹{gst}</p>

          <h3 className="mt-4 text-lg font-bold">
            Grand Total: ₹{grandTotal}
          </h3>
        </div>

        {/* PAYMENT SECTION */}
        <div className="rounded-xl p-6 border shadow-md">
          <h2 className="text-xl font-semibold mb-6">
            💳 Secure Payment
          </h2>

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

          {paymentMethod === "UPI" && (
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI ID"
              className="w-full p-3 rounded-lg border mb-4"
            />
          )}

          {paymentMethod === "CARD" && (
            <>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full p-3 rounded-lg border mb-3"
              />
              <div className="flex gap-3">
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-1/2 p-3 rounded-lg border"
                />
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  type="password"
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
        </div>
      </div>
    </PageContainer>
  );
}