"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const quickActions = ["Poster Banao 🎨", "Research Karo 🔍", "Video Script 🎥", "Notes Banao 📚"];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const newChats = [...chats, { role: "user", content: text }];
    setChats(newChats);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    const finalChats = [...newChats, { role: "ai", content: data.reply }];
    setChats(finalChats);
    setHistory([{ title: text.slice(0, 25), chats: finalChats },...history]);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#f9f9f5]">
      {/* Sidebar - ChatGPT Style */}
      <div className="w-[260px] bg-[#171717] text-white p-3 hidden md:flex flex-col">
        <button onClick={() => setChats([])} className="bg-white/10 p-3 rounded-lg mb-4">+ New Chat</button>
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-2">Chat History</p>
          {history.map((h, i) => (
            <div key={i} onClick={() => setChats(h.chats)} className="p-2 text-sm truncate cursor-pointer hover:bg-white/10 rounded">{h.title}</div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-3">
          <p className="font-bold">NawazAcademy</p>
          <p className="text-xs text-yellow-500">AI Ustad Dashboard</p>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b bg-white flex justify-between items-center">
          <h1 className="font-bold text-xl">Nawaz<span className="text-orange-500">Academy</span> - AI Ustad</h1>
          <a href="https://wa.me/923000000000" className="bg-green-600 text-white px-4 py-1 rounded-full text-sm">WhatsApp</a>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chats.length === 0? (
            <div className="text-center mt-20">
              <h2 className="text-4xl font-bold">AI-Powered Ustad <br/><span className="text-orange-500">for Everyone</span></h2>
              <p className="text-gray-500 mt-3">Poster, Research, Video, Notes - Sab kuch ek jagah</p>
              <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-8">
                {quickActions.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} className="p-3 bg-white rounded-xl shadow border hover:bg-gray-50">{q}</button>
                ))}
              </div>
            </div>
          ) : (
            chats.map((c, i) => (
              <div key={i} className={`p-4 rounded-xl max-w-3xl ${c.role === 'user'? 'bg-black text-white ml-auto' : 'bg-white shadow border'}`}>
                <pre className="whitespace-pre-wrap font-sans">{c.content}</pre>
              </div>
            ))
          )}
          {loading && <p className="text-gray-400">AI Ustad likh raha hai...</p>}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex max-w-3xl mx-auto gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} placeholder="English ya Urdu me kuch bhi puchen..." className="flex-1 p-3 border rounded-full outline-none" />
            <button onClick={() => sendMessage(input)} className="bg-black text-white px-6 rounded-full">Search</button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">English search = English jawab, Urdu search = Urdu jawab</p>
        </div>
      </div>
    </div>
  );
}
