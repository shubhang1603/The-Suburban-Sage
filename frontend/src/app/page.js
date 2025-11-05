export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <h1 className="text-5xl font-bold text-indigo-600 mb-4">Suburban Sage</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Discover your city’s pulse — AI-powered insights from news, sentiment, and urban data.
      </p>
      <input
        type="text"
        placeholder="Search for a city..."
        className="p-3 rounded-xl border border-gray-300 w-64 text-center placeholder-black placeholder-opacity-100 text-black"
      />
    </main>
  );
}
