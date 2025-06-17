import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import AppFooter from "./footer";
import { useNavigate } from "react-router-dom";

export default function MovieDetail() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setMovie(data))
      .catch((err) => {
        console.error("Error fetching movie:", err);
        setError(err.message);
      });
  }, [movieId]);

  if (error) {
    return <div className="text-red-500 p-10">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="text-white p-10">Loading movie details...</div>;
  }

  const formattedDate = new Date(movie.release_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#222] text-white min-h-screen px-4 md:px-16 py-10">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Poster */}
        <div className="relative w-full lg:w-[280px] rounded-xl overflow-hidden shadow-lg">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-center py-1 text-sm font-medium">
            In cinemas
          </div>
          
        </div>

        {/* Info */}
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl font-bold text-pink-500">{movie.title}</h1>

          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" />
            <span className="text-pink-400 font-semibold">{movie.rating}/10</span>
            <span className="text-gray-400 text-sm">(user votes)</span>
            <button className="ml-4 bg-yellow-400 text-black px-2 py-1 rounded-md text-sm font-semibold hover:bg-yellow-300">
              Rate now
            </button>
          </div>

          <div className="flex gap-2">
            <span className="border border-pink-500 px-2 py-1 text-sm rounded-md">2D</span>
            <span className="border border-pink-500 px-2 py-1 text-sm rounded-md">{movie.language}</span>
          </div>

          <p className="text-sm text-gray-300">
            {movie.duration} • {movie.genre} • ₹{movie.price} • {formattedDate}
          </p>
           <p className="text-gray-300 text-sm">
            <span className="font-semibold">Show Time:</span> {movie.show_time}
          </p>
          <p className="text-gray-300 text-sm">
            <span className="font-semibold">Theater:</span> {movie.theater_name}
          </p>
          <p className="text-gray-300 text-sm">
            <span className="font-semibold">Seats:</span> {movie.seats}
          </p>
          
          <div className="flex gap-3">
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ff2e63] hover:bg-[#e02759] text-white px-6 py-2 rounded-full font-semibold mt-2"
            >
              ▶ Trailer
            </a>
          

            <button  onClick={() => navigate("/showtimes", { state: { movie } })} className="bg-[#ff2e63] hover:bg-[#e02759] text-white px-6 py-2 rounded-full font-semibold mt-2">
              Book tickets
            </button>
          </div>
          
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 text-white max-w-4xl">
        <h2 className="text-2xl font-bold mb-3">About the movie</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{movie.description}</p>
      </div>
      <AppFooter />

      {/* Additional Info */}
    </div>
  );
}
