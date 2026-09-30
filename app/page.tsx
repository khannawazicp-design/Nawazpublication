"use client";
import { useState } from "react";
export default function Home() {
  const [q, setQ] = useState(""); const [list, setList] = useState<any[]>([]); const [loading, setLoading] = useState(false);
  async function doSearch() {
    if(!q) return; const userMsg = q; setQ(""); setList(p=>[...p, {role:"user", text:userMsg}]); setLoading(true);
    const res = await fetch("/api/chat", {method:"POST", body: JSON.stringify({message: userMsg})});
    const data = await res.json(); setList(p=>[...p, {role:"ai", text:data.reply}]); setLoading(false);
  }
  return (
    <main className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="p-4 text-center border-b border-zinc-800"><h1 className="font-bold">NawazPublication - AI Notes</h1></header>
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-3">
        {list.map((m,i)=><div key={i} className={m.role==="user"?"bg-zinc-800 p-3 rounded-xl ml-10":"bg-zinc-800 border border-zinc-700 p-3 rounded-xl whitespace-pre-wrap"}>{m.text}</div>)}
        {loading && <div className="text-zinc-400">AI soch raha hai...</div>}
      </div>
      <div className="p-4 sticky bottom-0 bg-zinc-900">
        <div className="max-w-3xl mx-auto flex bg-zinc-800 rounded-full px-4 py-2 border border-zinc-700">
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Matrix, Chemistry..." className="flex-1 bg-transparent outline-none p-2"/>
          <button onClick={doSearch} className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center">↑</button>
        </div>
      </div>
    </main>
  )
}
