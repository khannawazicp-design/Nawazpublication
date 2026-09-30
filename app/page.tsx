"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const handleSearch = () => {
    if (!query) return;
    setChat([...chat, `You: ${query}`, `Nawaz AI: ${query} ke notes abhi tayar ho rahe hain... WhatsApp par order karen!`]);
    setQuery("");
  };

  return (
    <main className="min-h-screen bg-[#212121] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 text-center border-b border-white/10">
        <h1 className="text-xl font-bold">NawazPublication</h1>
        <p className="text-xs text-gray-400">AI-Powered Notes | Urdu | English | Pashto</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-4 overflow-auto">
        {chat.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold mb-2">Kya search karna hai?</h2>
            <p className="text-gray-400 mb-6">Auto Language: اردو / پښتو / English</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button onClick={()=>setQuery("9th Urdu Notes")} className="border border-white/20 p-3 rounded-xl hover:bg-white/10">9th Urdu Notes</button>
              <button onClick={()=>setQuery("Matrix English Essay")} className="border border-white/20 p-3 rounded-xl hover:bg-white/10">English Essay</button>
              <button onClick={()=>setQuery("Pashto Literature")} className="border border-white/20 p-3 rounded-xl hover:bg-white/10">پښتو</button>
              <button onClick={()=>setQuery("10th Chemistry")} className="border border-white/20 p-3 rounded-xl hover:bg-white/10">Chemistry Notes</button>
            </div>
          </div>
        ) : (
          chat.map((msg, i) => (
            <div key={i} className={`p-3 rounded-xl ${msg.startsWith('You:') ? 'bg-[#303030] ml-12' : 'bg-transparent border border-white/10'}`}>
              {msg}
            </div>
          ))
        )}
      </div>

      {/* ChatGPT Style Search Bar */}
      <div className="p-4 bg-[#212121] sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center bg-[#303030] rounded-full px-4 py-2 border border-white/10 shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Matrix, 9th Class, Urdu Notes..."
            className="flex-
