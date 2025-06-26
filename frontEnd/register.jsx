import { useState } from "react";
import { User, Mail, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Registration successful!");
        localStorage.setItem("token", (await res.json()).token);
        console.log("Registration successful, token saved to localStorage",res);
        navigate("/login");
        
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      alert("Error during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>

        <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50">
          <User className="text-gray-400 mr-2" />
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="bg-transparent outline-none w-full" />
        </div>

        <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50">
          <Mail className="text-gray-400 mr-2" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="bg-transparent outline-none w-full" />
        </div>

        <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50">
          <Lock className="text-gray-400 mr-2" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="bg-transparent outline-none w-full" />
        </div>

        <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50">
          <Shield className="text-gray-400 mr-2" />
          <select name="role" value={form.role} onChange={handleChange} className="bg-transparent outline-none w-full">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">Register</button>
        <p className="text-center">if you have account? <a className="text-blue-900 font-bold underline hover:cursor-pointer" onClick={() => navigate('/login')}>Login</a></p>
      </form>
    </div>
  );
}
