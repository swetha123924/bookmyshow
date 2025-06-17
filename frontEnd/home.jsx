import HomeHeader from "./header";
import { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { Star, ThumbsUp } from "lucide-react";
import AppFooter from "./footer";
export default function Home() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const navigate = useNavigate();

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((response) => response.json())
      .then((data) => {
      setMovies(data);
      console.log("Fetched movies:", data);})
      .catch((error) => console.error("Error fetching movies:", error));
      
    fetch("http://localhost:5000/api/theaters")
      .then((response) => response.json())
      .then((data) => setTheaters(data))
      .catch((error) => console.error("Error fetching theaters:", error));
  }, []);

  

  return (
    <main className="bg-[#222] text-white min-h-screen">
      <HomeHeader />

      <section className="px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recommended Movies</h2>
          <a href="#" className="text-sm text-pink-600 hover:underline">
            See All ›
          </a>
        </div>

        {movies.length === 0 ? (
          <p className="text-red-500">No movies available currently.</p>
        ) : (
          <div className="flex overflow-x-auto gap-6 scrollbar-hide pb-2">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="min-w-[180px] max-w-[200px] flex-shrink-0 cursor-pointer"
              >
                <div className="relative rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-[270px] object-cover rounded"
                  />
                  {/* Optional "PROMOTED" badge */}
                  {movie.promoted && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                      PROMOTED
                    </span>
                  )}
                  {/* Bottom stats bar */}
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-80 text-white text-sm px-2 py-1 flex justify-between items-center">
                    {movie.rating ? (
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="w-4 h-4 text-red-500" />
                        {movie.rating}/10
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        {movie.likes} Likes
                      </span>
                    )}
                    <span className="text-xs">
                      {movie.votes
                        ? `${(movie.votes / 1000).toFixed(1)}K Votes`
                        : ""}
                    </span>
                  </div>
                </div>

                <h3 className="mt-2 font-semibold text-sm leading-tight">
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-600">{movie.genre}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <AppFooter />
    </main>
  );
}
