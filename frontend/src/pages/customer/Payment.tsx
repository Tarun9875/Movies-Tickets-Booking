// frontend/src/pages/customer/Payment.tsx

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import PageContainer from "../../components/layout/PageContainer";
import api from "../../services/axios";
import { toast } from "react-toastify";

export default function Payment() {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const bookingData = location.state;

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const {
    movieTitle,
    selectedSeats,
    selectedDate,
    selectedTime,
    selectedLanguage,
    totalPrice,
  } = bookingData;

  const [paymentMethod, setPaymentMethod] =
    useState<"UPI" | "CARD">("UPI");

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      if (paymentMethod === "UPI" && !upiId) {
        toast.error("Enter UPI ID");
        return;
      }

      if (
        paymentMethod === "CARD" &&
        (!cardNumber || !expiry || !cvv)
      ) {
        toast.error("Enter card details");
        return;
      }

      setProcessing(true);

      const res = await api.post("/bookings", {
        showId,
        seats: selectedSeats,
        paymentMethod,
        name: user?.name,
        email: user?.email,
        movieTitle,
        selectedDate,
        selectedTime,
        selectedLanguage,
        totalAmount: totalPrice,
      });

      toast.success("Booking Confirmed 🎉");

      navigate(`/my-bookings/${res.data.booking._id}`);

    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Payment failed ❌"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* BOOKING SUMMARY */}
        <div className="border p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Booking Summary
          </h2>

          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>

          <p><strong>Movie:</strong> {movieTitle}</p>
          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Language:</strong> {selectedLanguage}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <p className="mt-3 font-bold">
            Total: ₹{totalPrice}
          </p>
        </div>

        {/* PAYMENT SECTION */}
        <div className="border p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Payment
          </h2>

          {/* Payment Method Selection */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setPaymentMethod("UPI")}
              className={`px-4 py-2 rounded ${
                paymentMethod === "UPI"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              UPI
            </button>

            <button
              onClick={() => setPaymentMethod("CARD")}
              className={`px-4 py-2 rounded ${
                paymentMethod === "CARD"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Debit / Credit Card
            </button>
          </div>

          {/* UPI */}
          {paymentMethod === "UPI" && (
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-3 border rounded mb-4"
            />
          )}

          {/* CARD */}
          {paymentMethod === "CARD" && (
            <>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-3 border rounded mb-3"
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-1/2 p-3 border rounded"
                />

                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-1/2 p-3 border rounded"
                />
              </div>
            </>
          )}

          <button
            onClick={handlePayment}
            disabled={processing}
            className="mt-6 w-full py-3 rounded bg-red-600 text-white"
          >
            {processing ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </PageContainer>
  );
}