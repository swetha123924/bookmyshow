

import {
  Search,
  User,
  ChevronDown,
  Film,
  Tv,
  Calendar,
  Theater,
  Dumbbell,
  Activity,
} from "lucide-react";

import { useState } from "react";

const HomeHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleAdminPanel = () => {
    window.location.href = "/admin-panel";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="w-full bg-[#1f1f1f] text-white shadow-md">
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-4 gap-4">
        {/* Logo & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <img
            src="https://originserver-static1-uat.pvrcinemas.com/pvrcms/pvrinox/Logo/2025/PVR_logo_20250529.png"
            alt="BookMyShow"
            className="h-10 object-contain"
          />
          <div className="relative w-full sm:w-[350px]">
            <input
              type="text"
              placeholder="Search for Movies"
              className="w-full px-4 py-2 rounded-full bg-[#2a2a2a] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Search className="absolute top-2.5 right-4 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right Side - Admin, User Dropdown */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 w-full md:w-auto">
          {/* Admin Panel button */}
          {user?.role === "admin" && (
            <button
              onClick={handleAdminPanel}
              className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Admin Panel
            </button>
          )}

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 px-4 py-2 rounded-full text-sm font-medium focus:outline-none"
            >
              <User className="w-4 h-4" />
              {user ? user.email.charAt(0).toUpperCase() : "S"}
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <div className="block px-4 py-2 border-b border-gray-200 text-sm font-medium">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Links */}
      <nav className="flex flex-wrap justify-center gap-6 py-3 border-t border-gray-700 text-sm font-medium bg-[#222]">
        <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 transition">
          <Film className="w-4 h-4" />
          Movies
        </a>
        <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 transition">
          <Tv className="w-4 h-4" />
          Stream
        </a>
        <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 transition">
          <Calendar className="w-4 h-4" />
          Events
        </a>
        <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 transition">
          <Theater className="w-4 h-4" />
          Plays
        </a>
        <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 transition">
          <Dumbbell className="w-4 h-4" />
          Sports
        </a>
        <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-pink-400 transition">
          <Activity className="w-4 h-4" />
          Activities
        </a>
      </nav>
    </header>
  );
};

export default HomeHeader;
