"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Video from "@/components/video";

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;

export default function Home() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [bgImage, setBgImage] = useState("");
  const router = useRouter();

  const searchCity = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      const go = confirm("You must be logged in to access insights. Go to Login?");
      if (go) router.push("/login");
      return;
    }

    if (!city.trim()) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiBase}/api/city/${city}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    const json = await res.json();
    
    if (json.error) {
      setData(null);
      setBgImage("");
      return;
    }

    setData(json);

    // --- Fetch Unsplash photo ---
    try {
      const imgRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${city}&orientation=landscape&client_id=${client_id}`
      );
      const imgJson = await imgRes.json();
      const imageUrl = imgJson.results?.[0]?.urls?.regular;

      if (imageUrl) setBgImage(imageUrl);
      else setBgImage(""); // fallback if no image found
    } catch {
      setBgImage("");
    }
  };

  const resetToHero = () => {
  setCity("");
  setData(null);
  setBgImage("");
};


  return (
    <>
    <Header onReset={resetToHero}/>
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Show video background only when no city is searched */}
      {!bgImage && <Video />}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="relative z-10 w-full flex flex-col items-center">
       
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mt-24">
          Suburban Sage
        </h1>

        <p className="text-white opacity-90 text-center mt-3 drop-shadow-md max-w-md">
          Discover your city's pulse — weather, population & real-time insights.
        </p>

        {/* Search Bar */}
        <div className="flex gap-3 justify-center mt-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
            className="p-3 rounded-xl border border-white/40 bg-white/20 backdrop-blur-md 
                       placeholder-white text-white w-80 text-center"
          />

          <button
            onClick={searchCity}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition"
          >
            Search
          </button>
        </div>

        {/* City Info Panel */}
        {data && (
          <div className="mt-12 p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl text-white animate-fadeIn w-[90%] md:w-[500px]">
            <h2 className="text-3xl font-bold mb-3 drop-shadow">
              {data.city}, {data.country}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
              <p><strong>Population:</strong> {data.population?.toLocaleString() || "N/A"}</p>
              <p><strong>Temperature:</strong> {data.weather?.temperature || "N/A"}°C</p>
              <p><strong>Windspeed:</strong> {data.weather?.windspeed || "N/A"} km/h</p>
              <p><strong>Coordinates:</strong> {data.latitude || "N/A"}, {data.longitude || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
