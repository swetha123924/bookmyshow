import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MailIcon,
  Smartphone,
} from "lucide-react";

export default function AppFooter() {
  return (
    <footer className="bg-[#333033] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold text-pink-500">🎟️ BookMyTickets</h1>
          <p className="text-sm text-gray-400 mt-2">
            Your one-stop destination to book movies, concerts, sports, and more!
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer">Now Showing</li>
            <li className="hover:text-white cursor-pointer">Upcoming Movies</li>
            <li className="hover:text-white cursor-pointer">Events</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Support</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Connect with us</h2>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-400"><Facebook /></a>
            <a href="#" className="hover:text-pink-400"><Instagram /></a>
            <a href="#" className="hover:text-pink-400"><Twitter /></a>
            <a href="#" className="hover:text-pink-400"><Youtube /></a>
            <a href="mailto:support@bookmytickets.com" className="hover:text-pink-400"><MailIcon /></a>
          </div>
        </div>

        {/* Download App */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Get the App</h2>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <Smartphone className="text-pink-600" />
              <span className="text-sm font-medium">Download for Android</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <Smartphone className="text-pink-600" />
              <span className="text-sm font-medium">Download for iOS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-gray-700 text-center text-sm text-gray-400 py-4 px-4">
        © {new Date().getFullYear()} BookMyTickets. All rights reserved.
      </div>
    </footer>
  );
}
