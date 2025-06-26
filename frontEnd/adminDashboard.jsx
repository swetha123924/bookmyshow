import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import HomeHeader from "./header";
import { jwtDecode } from "jwt-decode";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [showTheaterForm, setShowTheaterForm] = useState(false);
  const [theaterForm, setTheaterForm] = useState({ name: "", location: "" });
  const [adminTheaters, setAdminTheaters] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [movieForm, setMovieForm] = useState({
    title: "", language: "", duration: "", genre: "", poster_url: "", trailer_url: "",
    release_date: "", rating: "", description: "", show_time: "", price: "", seats: "", theater_name: ""
  });

  // Get user info from token

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  // Fetch theaters created by admin
  useEffect(() => {
    const fetchTheaters = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/theaters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const decoded = jwtDecode(token);
      const adminOwnedTheaters = data.filter((t) => t.created_by === decoded.id);
      setAdminTheaters(adminOwnedTheaters);
    };
    fetchTheaters();
  }, []);


useEffect(() => {
  const fetchAdminMovies = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    console.log("Token:", token);
    console.log("Decoded:", decoded);

    try {
      const res = await fetch(`${BASE_URL}/api/movies/admin/${decoded.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setMovies(data);
      } else {
        console.error("Failed to fetch admin movies");
      }
    } catch (err) {
      console.error("Error fetching admin movies:", err);
    }
  };

  fetchAdminMovies();
}, []);




  const handleTheaterSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/api/theaters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(theaterForm),
      });

      const data = await res.json();
      setShowTheaterForm(false);
      setTheaterForm({ name: "", location: "" });
      setAdminTheaters([...adminTheaters, data]);
    } catch (err) {
      console.error("Error adding theater:", err);
    }
  };


  const handleMovieSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const url = editingMovie
    ? `${BASE_URL}/api/movies/${editingMovie.id}`
    : `${BASE_URL}/api/movies`;
  const method = editingMovie ? "PUT" : "POST";


  const moviePayload = {
  ...movieForm,
  show_time: movieForm.show_time
    ? movieForm.show_time.split(",").map((t) => t.trim())
    : [],
    
  admin_id: decoded.id,
};
console.log("Submitting movie payload:", moviePayload);


console.log("Submitting movie payload:", moviePayload);  // <--- ADD THIS

const res = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(moviePayload),
});

  const savedMovie = await res.json();

  if (res.ok) {
    if (editingMovie) {
      setMovies(movies.map((m) => (m.id === savedMovie.id ? savedMovie : m)));
    } else {
      setMovies([savedMovie, ...movies]);
    }
  } else {
    console.error("Error saving movie:", savedMovie.error || "Unknown error");
  }

  setMovieForm({
    title: "", language: "", duration: "", genre: "", poster_url: "", trailer_url: "",
    release_date: "", rating: "", description: "", show_time: "", price: "", seats: "", theater_name: ""
  });
  setEditingMovie(null);
  setShowMovieForm(false);
};


const handleEditMovie = (movie) => {
  setEditingMovie(movie);
  setMovieForm({
    ...movie,
    show_time: Array.isArray(movie.show_time) ? movie.show_time.join(", ") : movie.show_time,
  });
  setShowMovieForm(true);
};



  const handleDeleteMovie = async (id) => {
  const token = localStorage.getItem("token");
  if (!window.confirm("Are you sure you want to delete this movie?")) return;

  const res = await fetch(`${BASE_URL}/api/movies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    setMovies(movies.filter((m) => m.id !== id));
  } else {
    const data = await res.json();
    console.error("Delete failed:", data.error);
  }
};


  return (
    <>
      <HomeHeader />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🎭 Theater Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingMovie(null);
                setMovieForm({
                  title: "", language: "", duration: "", genre: "", poster_url: "", trailer_url: "",
                  release_date: "", rating: "", description: "", show_time: "", price: "", seats: "", theater_name: ""
                });
                setShowMovieForm(true);
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Movie
            </button>

            
              <button
                onClick={() => {
                  setShowTheaterForm(true);
                  setTheaterForm({ name: "", location: "" });
                }}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Theater
              </button>
           
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-3">Your Theaters</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {adminTheaters.map((theater) => (
              <li key={theater.id} className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition">
                <p className="font-medium text-gray-800">{theater.name}</p>
                <p className="text-sm text-gray-500">{theater.location}</p>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-xl font-bold text-gray-700 mb-4">Your Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="rounded-xl shadow p-4 bg-white">
                <img src={movie.poster_url} className="h-64 w-full object-fill rounded-md mb-3" />
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {movie.language} | {movie.genre} | {movie.duration}
                </p>
                <p className="text-sm text-gray-600 mb-1">🎬 Release: {movie.release_date?.split("T")[0]}</p>
                <p className="text-sm text-gray-600 mb-1">
                  ⏰ Show Time: {Array.isArray(movie.show_time) ? movie.show_time.join(", ") : movie.show_time}
                </p>

                <p className="text-sm text-gray-600 mb-1">💺 Seats: {movie.seats} | 💵 ₹{movie.price}</p>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">📖 {movie.description}</p>

                <div className="flex justify-between mt-2">
                  <button onClick={() => handleEditMovie(movie)} className="flex items-center text-blue-600 hover:text-blue-800">
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDeleteMovie(movie.id)} className="flex items-center text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
             <p className="text-gray-600">No movies found.</p>
          )}

        </div>
      </div>

      {/* Add Theater Modal */}
      {showTheaterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Theater</h2>
            <form onSubmit={handleTheaterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={theaterForm.name}
                  onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={theaterForm.location}
                  onChange={(e) => setTheaterForm({ ...theaterForm, location: e.target.value })}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setShowTheaterForm(false)} className="px-4 py-2 text-gray-600">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Add Theater
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     
      {showMovieForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editingMovie ? "Edit Movie" : "Add Movie"}
      </h2>

      <form onSubmit={handleMovieSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Title", key: "title" },
          { label: "Language", key: "language" },
          { label: "Duration", key: "duration" },
          { label: "Genre", key: "genre" },
          { label: "Poster URL", key: "poster_url" },
          { label: "Trailer URL", key: "trailer_url" },
          { label: "Release Date", key: "release_date", type: "date" },
          { label: "Rating", key: "rating" },
          { label: "Description", key: "description" },
          { label: "Show Time (comma separated)", key: "show_time" }, // TEXT input for array
          { label: "Price", key: "price", type: "number" },
          { label: "Seats", key: "seats", type: "number" },
          { label: "Theater Name", key: "theater_name" },
        ].map(({ label, key, type = "text" }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type={type}
              value={
                key === "show_time"
                  ? Array.isArray(movieForm.show_time)
                    ? movieForm.show_time.join(", ")
                    : movieForm.show_time
                  : movieForm[key]
              }
              onChange={(e) => setMovieForm({ ...movieForm, [key]: e.target.value })}
              required={
                key !== "description" && key !== "poster_url" && key !== "trailer_url"
              }
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        ))}

        <div className="col-span-full flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => {
              setShowMovieForm(false);
              setEditingMovie(null);
            }}
            className="px-4 py-2 text-gray-600"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editingMovie ? "Update Movie" : "Add Movie"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </>
  );
}

