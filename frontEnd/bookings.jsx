import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "./header";
import AppFooter from "./footer";
import { Clock, MapPin, Ticket, Wallet } from "lucide-react";

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = "https://bookmyshow-1-jhez.onrender.com"; // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/bookings/${user.id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to load bookings");
        }
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [BASE_URL, navigate, user?.id]);

  const renderStatus = (booking) => {
    const status = booking.booking_status || "booked";
    if (status === "booked") return "Confirmed";
    if (status === "cancelled") return "Cancelled";
    return status;
  };

  return (
    <main className="bg-[#0b0c10] text-white min-h-screen">
      <HomeHeader />

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-400">Your tickets</p>
            <h1 className="text-3xl font-bold">My Bookings</h1>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold"
          >
            Back to Home
          </button>
        </div>

        {loading && <p className="text-gray-300">Loading bookings…</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-3">
            <p className="text-lg font-semibold">No tickets yet</p>
            <p className="text-gray-400 text-sm">Book a show to see it appear here.</p>
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-500 rounded-full text-sm font-semibold"
            >
              Browse Movies
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row"
            >
              <div className="md:w-40 h-32 md:h-auto bg-black/30 flex items-center justify-center">
                {booking.poster_url ? (
                  <img
                    src={booking.poster_url}
                    alt={booking.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Ticket className="w-10 h-10 text-pink-400" />
                )}
              </div>

              <div className="flex-1 p-5 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">{renderStatus(booking)}</p>
                    <h3 className="text-xl font-semibold">{booking.title || "Movie"}</h3>
                    <p className="text-sm text-gray-300">{booking.theater_name || "Theater"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-lg font-semibold">₹{booking.total_price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-400" />
                    <span>{new Date(booking.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{booking.language || "English"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-pink-400" />
                    <span>Seats: {Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AppFooter />
    </main>
  );
}
