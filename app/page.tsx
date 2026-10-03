"use client"
import { useState } from "react";

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{q:string,a:string}[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if(!msg) return;
    setLoading(true);
    const q = msg;
    setMsg("");
    setChat(prev=>[...prev, {q, a: "Thinking..."}]);
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: q })
    });
    const data = await res.json();
    setChat(prev=>{ let n=[...prev]; n[n.length-1].a = data.reply; return n; });
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Nawaz Publication</h1>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">AI Powered</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3">Nawaz Academy AI</h2>
          <p className="text-gray-500">Ask any question about Science, Math, or upload an image.</p>
        </div>

        <div className="space-y-4 mb-20">
          {chat.map((c,i)=>(
            <div key={i} className="space-y-2">
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-br-none ml-auto max-w-[80%]">{c.q}</div>
              <div className="bg-white border p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[90%] whitespace-pre-wrap">{c.a}</div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="What is science?" className="flex-1 border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={send} disabled={loading} className="bg-blue-600 text-white px-8 rounded-full font-medium disabled:opacity-50">{loading?'...':'Send'}</button>
          </div>
        </div>
      </main>
    </div>
  )
}
