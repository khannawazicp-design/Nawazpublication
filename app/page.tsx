"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);

  async function search() {
    if(!q) return;
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ query: q })
    });
    const data = await res.json();
    setAns(data.answer);
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-green-700">NawazPublication</h1>
        <p className="text-gray-600">AI-Powered Notes | Urdu | English | Pashto</p>
      </header>

      <div className="flex gap-2 mt-8">
        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Koi bhi sawal likhein... مثلا: Photosynthesis kya hai?"
          className="flex-1 border p-3 rounded-lg"
        />
        <button onClick={search} className="bg-green-600 text-white px-6 rounded-lg">
          {loading ? "..." : "Search"}
        </button>
      </div>

      {ans && (
        <div className="mt-6 bg-white p-5 rounded-xl shadow border whitespace-pre-wrap">
          {ans}
        </div>
      )}

      <footer className="text-center mt-12 text-sm text-gray-500">
        NawazPublication.com | Auto Language: English / اردو / پښتو
      </footer>
    </div>
  );
}
