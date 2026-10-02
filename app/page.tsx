"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if(!q.trim()) return;
    setLoading(true);
    setAns("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      setAns(data.answer);
    } catch(e) {
      setAns("Error: Dobara koshish karen");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#FFFBEB] text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-black">Nawaz<span className="text-amber-600">Academy</span></h1>
          <a href="https://wa.me/923000000000" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">WhatsApp</a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-6xl font-black">AI-Powered Notes for <br/><span className="text-amber-600">Every Student</span></h2>
        <p className="mt-3 text-gray-600">Maths, Physics, Chemistry, Islamiat, Urdu - Har sawal ka sahi jawab</p>

        <div className="mt-8 max-w-2xl mx-auto bg-white p-5 rounded-2xl shadow-xl text-left">
          <div className="flex gap-2">
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter' && askAI()} placeholder="Sawal likhen... e.g. Fatah Makkah kab hua?" className="border flex-1 px-4 py-3 rounded-xl outline-none" />
            <button onClick={askAI} className="bg-black text-white px-6 py-3 rounded-xl font-bold">{loading? "..." : "Search"}</button>
          </div>
          {ans && <div className="mt-4 bg-[#FFFBEB] p-4 rounded-xl whitespace-pre-wrap leading-7">{ans}</div>}
        </div>
      </section>

      <footer className="bg-black text-white text-center py-8">
        <p className="font-bold">Nawaz Academy © 2026</p>
        <p className="text-sm text-gray-400">Sahi Jawabat | To-the-point | AI Powered</p>
      </footer>
    </main>
  );
}
