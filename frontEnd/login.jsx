import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Login successful, token saved to localStorage", data);
        navigate("/home");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

        <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50">
          <Mail className="text-gray-400 mr-2" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="bg-transparent outline-none w-full" />
        </div>

        <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50">
          <Lock className="text-gray-400 mr-2" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="bg-transparent outline-none w-full" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">Login</button>
        <p className="text-center">if you don'thave account? <a className="text-blue-900 font-bold underline hover:cursor-pointer" onClick={() => navigate('/')}>Register</a></p>
      </form>
    </div>
  );
}
