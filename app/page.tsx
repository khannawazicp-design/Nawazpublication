"use client"
import { useState, useEffect } from "react"

type Chat = { id: string, title: string, msgs: { q: string, a: string }[] }

export default function Home(){
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const saved = localStorage.getItem("nawaz_chats")
    if(saved){ const p = JSON.parse(saved); setChats(p); if(p[0]) setActiveId(p[0].id) }
    else { createNew() }
  },[])

  useEffect(()=>{ if(chats.length) localStorage.setItem("nawaz_chats", JSON.stringify(chats)) },[chats])

  function createNew(){
    const id = Date.now().toString()
    const newChat = { id, title: "New Chat", msgs: [] }
    setChats(c=>[newChat,...c]); setActiveId(id)
  }

  const activeChat = chats.find(c=>c.id===activeId)

  async function send(){
    if(!input.trim() ||!activeChat) return
    const q = input; setInput(""); setLoading(true)
    const isPaper = q.toLowerCase().includes("paper") || q.toLowerCase().includes("guess")

    // Update UI
    setChats(prev=>prev.map(c=> c.id===activeId? {...c, title: c.msgs.length===0? q.slice(0,30) : c.title, msgs:[...c.msgs, {q, a:"..."}]} : c ))

    const prompt = isPaper
   ? `User wants paper: "${q}". You are Nawaz Publication AI. Generate a complete guess paper / past paper for it in clean format with MCQs, Short Questions, Long Questions. In end say "PDF download ke liye contact karein". Language: Urdu/English mix.`
    : q

    const res = await fetch("/api/chat",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message: prompt})})
    const data = await res.json()

    setChats(prev=>prev.map(c=> c.id===activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a: data.reply} : m)} : c ))
    setLoading(false)
  }

  return(
    <div className="flex h-screen bg-[#f7f7f8] text-slate-900">
      {/* SIDEBAR */}
      <div className="w-[260px] bg-[#202123] text-white hidden md:flex flex-col p-2">
        <button onClick={createNew} className="border border-white/20 rounded-md py-3 text-sm mb-4">+ New Chat</button>
        <div className="flex-1 overflow-auto space-y-1">
          {chats.map(c=><div key={c.id} onClick={()=>setActiveId(c.id)} className={`p-3 rounded-md cursor-pointer text-sm truncate ${activeId===c.id?'bg-[#343541]':'hover:bg-white/10'}`}>{c.title}</div>)}
        </div>
        <div className="p-3 border-t border-white/10 text-xs text-center">NAWAZ PUBLICATION<br/>Rawalpindi</div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4 flex justify-between items-center md:hidden">
          <b>NAWAZ AI</b><button onClick={createNew} className="bg-black text-white px-3 py-1 rounded">+ New</button>
        </div>

        <div className="flex-1 overflow-auto max-w-3xl w-full mx-auto p-4 pb-32 space-y-6">
          {activeChat?.msgs.length===0 && (
            <div className="mt-20 text-center">
              <h1 className="text-3xl font-bold">Nawaz Academy AI</h1>
              <p className="text-gray-500 mt-2">Paper chahiye? Likhein "9th Physics Paper 2024"</p>
              <div className="grid grid-cols-2 gap-2 mt-6 text-sm">
                <div onClick={()=>setInput("9th Class Physics Guess Paper 2025")} className="border bg-white p-3 rounded-lg cursor-pointer">📄 9th Guess Paper</div>
                <div onClick={()=>setInput("What is matrix? Explain with example")} className="border bg-white p-3 rounded-lg cursor-pointer">🧮 Matrix Solver</div>
                <div onClick={()=>setInput("Science kya hai? Asan lafzon me samjhao")} className="border bg-white p-3 rounded-lg cursor-pointer">🔬 Science</div>
                <div onClick={()=>setInput("Image se sawal hal karo")} className="border bg-white p-3 rounded-lg cursor-pointer">🖼️ Image to Text</div>
              </div>
            </div>
          )}
          {activeChat?.msgs.map((m,i)=><div key={i} className="space-y-4"><div className="flex justify-end"><div className="bg-[#f7f7f8] border px-4 py-2 rounded-2xl max-w-[80%]">{m.q}</div></div><div className="bg-white border shadow-sm p-4 rounded-2xl whitespace-pre-wrap leading-7">{m.a}</div></div>)}
        </div>

        <div className="fixed md:sticky bottom-0 left-0 md:left-[260px] right-0 bg-white/80 backdrop-blur border-t p-3">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Paper ka naam likhein ya koi sawal..." className="flex-1 border rounded-full px-5 py-3 outline-none shadow-sm"/>
            <button onClick={send} disabled={loading} className="bg-black text-white w-12 h-12 rounded-full">{loading?"..":"↑"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
