"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState<string[]>([]);

  function doSearch() {
    if (!query) return;
    setList([...list, "You: " + query, "Nawaz AI: " + query + " ke notes tayar hain. WhatsApp par rabta karen!"]);
    setQuery("");
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="p-4 text-center border-b border-zinc-800">
        <h1 className="text-xl font-bold">NawazPublication</h1>
        <p className="text-xs text-zinc-400">AI-Powered Notes | Urdu | English | Pashto</p>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-3">
        {list.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold mb-2">Kya search karna hai?</h2>
            <p className="text-zinc-400 mb-6">Auto Language: Urdu / Pashto / English</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button onClick={() => setQuery("9th Urdu Notes")} className="border border-zinc-700 p-3 rounded-xl">9th Urdu Notes</button>
              <button onClick={() => setQuery("English Essay")} className="border border-zinc-700 p-3 rounded-xl">English Essay</button>
              <button onClick={() => setQuery("Pashto Notes")} className="border border-zinc-700 p-3 rounded-xl">Pashto Notes</button>
              <button onClick={() => setQuery("10th Chemistry")} className="border border-zinc-700 p-3 rounded-xl">Chemistry Notes</button>
            </div>
          </div>
        ) : (
          list.map((m, i) => (
            <div key={i} className={m.startsWith("You") ? "bg-zinc-800 p-3 rounded-xl ml-10" : "border border-zinc-700 p-3 rounded-xl"}>
              {m}
            </div>
          ))
        )}
      </div>

      <div className="p-4 sticky bottom-0 bg-zinc-900">
        <div className="max-w-3xl mx-auto flex items-center bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
            placeholder="Matrix, 9th Class..."
            className="flex-1 bg-transparent outline-none p-2"
          />
          <button onClick={doSearch} className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
            ↑
          </button>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-2">NawazPublication.com</p>
      </div>
    </main>
  );
}
