"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";

export default function Header()
{
  const router = useRouter();
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  },[]);

  const handleHomeClick = () =>
  {
    if(typeof window !== "undefined")
    {
      window.location.href = "/";
    }
  }

  const handleLogout = () =>
  {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  }

  return (
    <div className="w-full px-4 py-4 absolute top-0 z-50">
      <header className="w-full bg-black/20 rounded-xl shadow-sm overflow-hidden">
        <div className="px-7 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-white drop-shadow-lg" style={{ fontFamily: 'Righteous' }} onClick={handleHomeClick}>
           <Link href="/"> The Suburban Sage </Link>
          </div>
          {isLoggedIn ?(
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">Logout</button>
          ):( <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            <Link href="/login">
            Login
            </Link>
          </button>)}
        </div>
      </header>
    </div>
  );
}