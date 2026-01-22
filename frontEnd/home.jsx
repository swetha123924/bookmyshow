import HomeHeader from "./header";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star, ThumbsUp } from "lucide-react";
import AppFooter from "./footer";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = "https://bookmyshow-1-jhez.onrender.com"; // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const placeholderPoster =
    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80";

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/movies`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        console.log("Fetched movies:", data);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, [BASE_URL]);

  const featuredMovie = useMemo(() => movies[0], [movies]);

  return (
    <main className="bg-[#0b0c10] text-white min-h-screen">
      <HomeHeader />

      <section className="bg-gradient-to-br from-[#0f172a] via-[#0b132b] to-[#0f0f11]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-white/10 text-pink-200 rounded-full">
              <Sparkles className="w-4 h-4" />
              Book your next show
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Discover movies, events, and experiences you will love.
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl">
              Pick from the latest releases, find nearby theatres, and breeze through booking with a single tap.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Instant e-tickets
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Secure payments
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-pink-500/10 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img
                src={featuredMovie?.poster_url || placeholderPoster}
                alt={featuredMovie?.title || "Featured movie"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute bottom-0 p-5 space-y-2">
                <p className="text-xs uppercase tracking-wide text-gray-300">Featured</p>
                <h3 className="text-xl font-semibold">{featuredMovie?.title || "Now Showing"}</h3>
                <p className="text-sm text-gray-300 max-w-md">
                  {featuredMovie?.description || "Grab your seats for the biggest releases and exclusive premieres."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-2xl font-bold">Recommended Movies</h2>
          <button className="text-sm text-pink-400 hover:text-pink-300 font-semibold">See all ›</button>
        </div>

        {movies.length === 0 ? (
          <p className="text-red-400">No movies available currently.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="group cursor-pointer bg-[#11131e] border border-white/5 rounded-2xl overflow-hidden shadow-lg transition hover:-translate-y-1 hover:shadow-pink-500/20"
              >
                <div className="relative">
                  <img
                    src={movie.poster_url || placeholderPoster}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  {movie.promoted && (
                    <span className="absolute top-3 right-3 bg-pink-600 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
                      PROMOTED
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs">
                    {movie.genre || "Now Showing"}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {movie.rating ? `${movie.rating}/10` : "New"}
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <ThumbsUp className="w-4 h-4" />
                      {movie.votes ? `${(movie.votes / 1000).toFixed(1)}K votes` : "Popular"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{movie.title}</h3>
                  <p className="text-sm text-gray-400 h-[44px] overflow-hidden">
                    {movie.description || "Experience the best stories on the big screen."}
                  </p>
                  <div className="text-xs text-gray-500">
                    {[movie.language, movie.duration].filter(Boolean).join(" • ") || "All languages"}
                  </div>
                  <button className="w-full mt-2 py-2 rounded-full bg-white/10 hover:bg-pink-600/80 text-sm font-semibold transition">
                    Book seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <AppFooter />
    </main>
  );
}
