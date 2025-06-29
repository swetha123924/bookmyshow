import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeHeader from "./header";
import AppFooter from "./footer";

export default function SelectSeatsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { movie, theater, showtime, selectedDate, show_id } = state || {};
  const BASE_URL = "https://bookmyshow-1-jhez.onrender.com";
  const numericPrice = Number(movie?.price || 0);

  const seatLayout = {
    VIP: { rows: ["M"], price: 295 },
    PREMIUM: { rows: ["L", "K", "J", "I", "H", "G", "F", "E"], price: numericPrice },
    EXECUTIVE: { rows: ["D", "C", "B"], price: numericPrice },
    NORMAL: { rows: ["A"], price: numericPrice },
  };

  const totalColumns = 15;

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/booked-seats?show_id=${show_id}&date=${selectedDate}`);
        const data = await res.json();
        console.log("Fetched booked seats:", data);

        // Normalize to array of seat strings
        const seatsArray = Array.isArray(data.bookedSeats)
          ? data.bookedSeats.flatMap(seat => typeof seat === 'string' ? seat : seat.seat)
          : [];

        setBookedSeats(seatsArray);
      } catch (err) {
        console.error("Error fetching booked seats:", err);
      }
    };

    fetchBookedSeats();
  }, [show_id, selectedDate]);

  useEffect(() => {
    const price = selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat.charAt(0)), 0);
    setTotalPrice(price);
  }, [selectedSeats]);

  const getSeatPrice = (rowLabel) => {
    for (const category in seatLayout) {
      if (seatLayout[category].rows.includes(rowLabel)) {
        return Number(seatLayout[category].price);
      }
    }
    return 0;
  };

  const handleSeatSelect = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeatsForRow = (rowLabel) => {
    const seats = Array.from({ length: totalColumns }, (_, i) => `${rowLabel}${i + 1}`);

    return (
      <div key={rowLabel} className="flex items-center mb-1">
        <span className="w-6 text-sm font-medium">{rowLabel}</span>
        <div className="flex flex-wrap gap-1">
          {seats.map((seatId) => {
            const isBooked = bookedSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);

            return (
              <button
                key={seatId}
                onClick={() => handleSeatSelect(seatId)}
                disabled={isBooked}
                className={`w-10 h-10 rounded text-sm font-semibold transition-all duration-200
                  ${isBooked
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : isSelected
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-blue-200"}`}
              >
                {seatId.slice(1)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleConfirmBooking = () => {
    if (!selectedSeats.length) return alert("Please select at least 1 seat");

    navigate("/payment", {
      state: {
        movie,
        theater,
        showtime,
        selectedDate,
        seats: selectedSeats,
        totalPrice,
        show_id,
      },
    });
  };

  if (!movie) {
    return <div className="text-center p-10 text-gray-700">Loading movie details...</div>;
  }

  return (
    <>
      <HomeHeader />
      <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
        <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-pink-600">Select Your Seats</h1>

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 text-sm mb-6">
            <p><strong>🎬 Movie:</strong> {movie.title}</p>
            <p><strong>🎭 Theater:</strong> {theater.name}</p>
            <p><strong>⏰ Showtime:</strong> {showtime}</p>
            <p><strong>📅 Date:</strong> {selectedDate}</p>
          </div>

          {Object.entries(seatLayout).map(([section, { rows, price }]) => (
            <div key={section} className="mb-6">
              <h2 className="text-md font-semibold mb-1 text-gray-700">
                ₹{Number(price).toFixed(0)} - <span className="uppercase">{section}</span>
              </h2>
              {rows.map((row) => renderSeatsForRow(row))}
            </div>
          ))}

          <div className="mt-6 border-t pt-4">
            <p className="font-medium mb-1">
              🎟️ <span className="text-gray-700">Selected Seats:</span>{" "}
              <span className="text-pink-600 font-bold">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
              </span>
            </p>

            {selectedSeats.length > 0 && (
              <div className="mb-2 text-sm text-gray-600">
                {selectedSeats.map((seat) => (
                  <div key={seat}>
                    Seat <strong>{seat}</strong>: ₹{getSeatPrice(seat.charAt(0)).toFixed(0)}
                  </div>
                ))}
              </div>
            )}

            <p className="mt-2 font-semibold text-lg">
              💰 Total Price: <span className="text-green-600">₹{Number(totalPrice).toFixed(0)}</span>
            </p>

            <button
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0}
              className={`mt-4 w-full sm:w-auto px-6 py-2 rounded-md font-semibold shadow 
                ${selectedSeats.length
                  ? "bg-pink-500 hover:bg-pink-600 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"}`}
            >
              Confirm & Proceed
            </button>
          </div>
        </div>
      </div>
      <AppFooter />
    </>
  );
}
