import { useLocation, useNavigate } from "react-router-dom";
import HomeHeader from "./header";
import AppFooter from "./footer";

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    booking,
    movie,
    theater,
    showtime,
    selectedDate,
    seats
  } = state || {};

  if (!booking) {
    return (
      <div className="text-center p-10">
        <h1 className="text-xl font-bold text-red-600">Invalid access</h1>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <>
      <HomeHeader />
      <div className="min-h-screen bg-green-50 p-6 flex justify-center items-center">
        <div className="bg-white rounded shadow p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
            Booking Confirmed! 🎉
          </h2>

          <div className="space-y-4 text-gray-700">
            <p><span className="font-semibold">Movie:</span> {movie?.title}</p>
            <p><span className="font-semibold">Theater:</span> {theater?.name}</p>
            <p><span className="font-semibold">Showtime:</span> {selectedDate} | {showtime}</p>
            <p><span className="font-semibold">Seats:</span> {seats?.join(", ")}</p>
            <p><span className="font-semibold">Booking ID:</span> {booking?.id}</p>
            <p><span className="font-semibold">Total Paid:</span> ₹{booking?.total_price}</p>
            <p><span className="font-semibold">Booking Status:</span> {booking?.booking_status}</p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <AppFooter />
    </>
  );
}
