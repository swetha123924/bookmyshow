import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ShowtimePage() {
  const location = useLocation();
  const movie = location.state?.movie;
  const [theaters, setTheaters] = useState([]);
  const [selectedDate, setSelectedDate] = useState("12 Jun");
  const navigate = useNavigate();
  const user_id = JSON.parse(localStorage.getItem("user")).id;
  console.log(user_id);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  

  useEffect(() => {
    const fetchTheaters = async () => {
      if (!movie?.title) return;

      try {
        const res = await fetch(`${BASE_URL}/api/theaters/by-movie-title/${movie.title}`);
        const data = await res.json();
        console.log("Fetched theater data:", data);

        if (Array.isArray(data)) {
          setTheaters(data);
        } else {
          console.error("Expected array but got:", data);
          setTheaters([]);
        }
      } catch (err) {
        console.error("Failed to fetch theaters:", err);
        setTheaters([]);
      }
    };

    fetchTheaters();
  }, [movie]);

  const formatTime = (time) => {
    try {
      return new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      {movie ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{movie.title} - ({movie.language})</h1>
          <div className="text-sm text-gray-500 mb-4 space-x-2">
            <span className="border px-2 py-0.5 rounded-full">{movie.certificate || "U/A"}</span>
            <span>{movie.genre}</span>
          </div>

          {/* Date Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {["12 Jun", "13 Jun", "14 Jun", "15 Jun", "16 Jun", "17 Jun", "18 Jun"].map((date, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 border rounded-md text-sm ${
                  selectedDate === date ? "bg-pink-500 text-white" : "bg-white text-gray-700"
                }`}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Movie Poster */}
          <div className="flex justify-center mb-6">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Theaters List */}
          <div className="space-y-6">
  {theaters.length === 0 ? (
    <p className="text-center text-gray-500">No theaters showing this movie.</p>
  ) : (
    theaters.map((theater, idx) => (
      <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold">{theater.name}</h3>
            <p className="text-sm text-gray-600">{theater.location || "Location not available"}</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            {(Array.isArray(movie.show_time) ? movie.show_time : []).map((time, i) => {
              if (!time) return null;
              
              const formattedTime = formatTime(time.trim());

              return (
                <div key={i} className="text-center">
                  <button
                    className="border border-green-600 text-green-600 px-4 py-1 rounded-md text-sm font-semibold hover:bg-green-50"
                    onClick={() =>
                      navigate("/select-seats", {
                        state: {
                          movie,
                          theater,
                          showtime: formattedTime,
                          selectedDate,
                          show_id: theater.id ,
                          user_id,
                        },
                      })
                    }
                  >
                    {formattedTime}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">Cancellation available</p>
                </div>
              );
            })}
          </div> 
        </div>
      </div>
     
    )) 
  )} 
</div>

        </>
      ) : (
        <p className="text-center text-red-500 text-lg">No movie data found.</p>
      )}
    </main>
  );
}
