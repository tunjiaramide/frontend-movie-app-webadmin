import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Movie {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  uploadedAt: string;
  metadata: {
    genre?: string;
    year?: number;
    [key: string]: any;
  };
}

const API_BASE = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); 
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/movies`);
      if (!res.ok) {
        throw new Error(`Failed to fetch movies: ${res.status}`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch movies at the moment.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Uploaded Movies</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <p className="my-5">
        <Link
          to="/upload-movie"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Upload a Movie
        </Link>
      </p>
      {loading && <p className="text-gray-500">Loading movies...</p>}
      {!loading && (movies.length === 0 || error) && (
        <p className="text-gray-500">No movies for now.</p>
      )}

      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={movie.thumbnailUrl}
                alt={movie.title}
                className="mb-2 w-full h-40 object-cover rounded"
              />
              <h3 className="font-bold text-lg">{movie.title}</h3>
              {movie.metadata.genre && <p>🎭 Genre: {movie.metadata.genre}</p>}
              {movie.metadata.year && <p>📅 Year: {movie.metadata.year}</p>}
              <video controls className="w-full mt-2 rounded">
                <source src={movie.videoUrl} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
