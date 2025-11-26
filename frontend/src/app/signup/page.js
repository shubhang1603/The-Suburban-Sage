"use client";

import { useState } from "react";
import { signup } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header"
import Video from "@/components/video";


export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(form.username, form.email, form.password);
    if (res.token) {
      localStorage.setItem("token", res.token);
      router.push("/"); // redirect to homepage
    } else {
      setMessage(res.message || "Signup failed");
    }
  };

  return (
    <>
    <Video/>
    <Header/>
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input name="username" placeholder="Username" onChange={handleChange} className="p-3 rounded-xl border border-gray-300 text-white" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-3 rounded-xl border border-gray-300 text-white" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-3 rounded-xl border border-gray-300 text-white" />
        <Link href="/login" className="text-white underline text-center">Already have an account ? Login</Link>
        <button className="bg-indigo-600 text-white p-3 rounded-xl">Signup</button>
      </form>
      {message && <p className="text-red-500 mt-3">{message}</p>}
    </div>
    </>
  );
}
