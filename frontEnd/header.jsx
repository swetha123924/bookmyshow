

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Calendar,
  ChevronDown,
  Dumbbell,
  Film,
  Ticket,
  Search,
  Theater,
  Tv,
  User,
} from "lucide-react";

const navLinks = [
  { icon: Film, label: "Movies" },
  { icon: Tv, label: "Stream" },
  { icon: Calendar, label: "Events" },
  { icon: Theater, label: "Plays" },
  { icon: Dumbbell, label: "Sports" },
  { icon: Activity, label: "Activities" },
  { icon: Ticket, label: "My Tickets", to: "/bookings" },
];

const HomeHeader = () => {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleAdminPanel = () => {
    window.location.href = "/admin-panel";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#0f0f11] via-[#0b0b0f] to-[#131322] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 py-4 flex-nowrap overflow-x-auto">
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/pvrinox/Logo/2025/PVR_logo_20250529.png"
              alt="BookMyShow"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold">BookMyShow</span>
              <span className="text-xs text-gray-400">Movies · Events · Sports</span>
            </div>
          </div>

          <div className="relative flex-1 min-w-[220px] max-w-2xl">
            <input
              type="text"
              placeholder="Search movies, theatres, events"
              className="w-full bg-white/5 border border-white/10 rounded-full px-12 py-3 text-sm placeholder:text-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {user?.role === "admin" && (
              <button
                onClick={handleAdminPanel}
                className="hidden sm:inline-flex bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition"
              >
                Admin Panel
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition"
              >
                <User className="w-4 h-4" />
                {user ? user.email.charAt(0).toUpperCase() : "S"}
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 text-sm font-semibold bg-gray-50">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-4 overflow-x-auto">
          {navLinks.map(({ icon: Icon, label, to }) => (
            <button
              key={label}
              onClick={() => {
                if (to) navigate(to);
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/15 rounded-full text-sm font-medium text-gray-200 whitespace-nowrap transition"
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
