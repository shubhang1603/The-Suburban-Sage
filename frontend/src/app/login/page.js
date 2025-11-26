"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Video from "@/components/video";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiBase}/api/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: form.email, 
          password: form.password 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Network error - please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Video/>
      <Header/>
      <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64 bg-opacity-20  p-6 rounded-xl">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email}
            onChange={handleChange} 
            required
            className="p-3 rounded-xl border border-white bg-transparent text-white placeholder-gray-300" 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password}
            onChange={handleChange} 
            required
            className="p-3 rounded-xl border border-white bg-transparent text-white placeholder-gray-300" 
          />
          <Link href="/signup" className="text-white underline text-center drop-shadow-md">
            Don't have an account? Sign up
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && <p className="text-red-500 mt-3 drop-shadow-lg bg-white/20 p-2 rounded">{message}</p>}
      </div>
    </>
  );
}
