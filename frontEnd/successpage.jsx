import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeHeader from "./header";
import AppFooter from "./footer";

export default function SuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const BASE_URL = "https://bookmyshow-1-jhez.onrender.com";
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookingData, setBookingData] = useState(state?.booking || null);
  const [meta, setMeta] = useState({
    movie: state?.movie,
    theater: state?.theater,
    showtime: state?.showtime,
    selectedDate: state?.selectedDate,
    seats: state?.seats,
  });
  const [loading, setLoading] = useState(!state?.booking);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingData || !user?.id) return;

    const fetchLatest = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/bookings/${user.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load booking");
        const latest = data.bookings?.[0];
        setBookingData(latest || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [BASE_URL, bookingData, user?.id]);

  if (!bookingData && loading) {
    return <div className="text-center p-10">Loading booking details…</div>;
  }

  if (!bookingData) {
    return (
      <div className="text-center p-10">
        <h1 className="text-xl font-bold text-red-600">No booking found</h1>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const seats = meta.seats || bookingData.seats || [];
  const movieTitle = meta.movie?.title || bookingData.title;
  const theaterName = meta.theater?.name || bookingData.theater_name;

  return (
    <>
      <HomeHeader />
      <div className="min-h-screen bg-green-50 p-6 flex justify-center items-center">
        <div className="bg-white rounded shadow p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
            Booking Confirmed! 🎉
          </h2>

          <div className="space-y-4 text-gray-700">
            <p><span className="font-semibold">Movie:</span> {movieTitle}</p>
            <p><span className="font-semibold">Theater:</span> {theaterName}</p>
            <p><span className="font-semibold">Showtime:</span> {meta.selectedDate || "--"} | {meta.showtime || "--"}</p>
            <p><span className="font-semibold">Seats:</span> {Array.isArray(seats) ? seats.join(", ") : seats}</p>
            <p><span className="font-semibold">Booking ID:</span> {bookingData?.id}</p>
            <p><span className="font-semibold">Total Paid:</span> ₹{bookingData?.total_price}</p>
            <p><span className="font-semibold">Booking Status:</span> {bookingData?.booking_status || "booked"}</p>
          </div>

          <div className="mt-8 flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/bookings")}
              className="bg-pink-600 text-white px-6 py-2 rounded font-semibold"
            >
              View My Tickets
            </button>
          </div>
        </div>
      </div>
      <AppFooter />
    </>
  );
}
