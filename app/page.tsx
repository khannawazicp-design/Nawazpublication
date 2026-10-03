"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagram?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function ColorfulAnswer({ text }: { text: string }) {
  const clean = text.replace(/\*\*/g, "")
  return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9', fontSize: '14.5px' }}>
    {clean.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '6px' }} />
      if (line.toLowerCase().startsWith("definition:")) return <div key={i} style={{ background: '#f1f5f9', borderLeft: '4px solid #0ea5e9', padding: '7px 10px', borderRadius: '8px', fontWeight: 800, color: '#0f172a' }}>{line}</div>
      if (line.toLowerCase().startsWith("key points:")) return <div key={i} style={{ color: '#dc2626', fontWeight: 800, marginTop: '10px' }}>🔴 {line}</div>
      if (line.match(/^\d+\./)) return <div key={i} style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '10px', margin: '4px 0', color: '#1e293b' }}>• {line.replace(/^\d+\.\s*/, "")}</div>
      if (line.toLowerCase().startsWith("example:") || line.toLowerCase().startsWith("importance:")) return <div key={i} style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '6px 10px', borderRadius: '8px', fontWeight: 700, color: '#15803d', marginTop: '8px' }}>🟢 {line}</div>
      if (line.includes("NAWAZ AI ACADEMY")) return <div key={i} style={{ textAlign: 'right', color: '#7c3aed', fontWeight: 800, fontSize: '11px', marginTop: '10px' }}>{line}</div>
      return <div key={i} style={{ color: '#334155' }}>{line}</div>
    })}
  </div>
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]); const [activeId, setActiveId] = useState(""); const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [isListening, setIsListening] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null); const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_final_v6"); if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_v6", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])

  const active = chats.find(c => c.id === activeId)

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) return; const rec = new SR(); rec.lang = "en-US"; rec.onstart = () => setIsListening(true); rec.onend = () => setIsListening(false)
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript); rec.start()
  }

  async function send() {
    if (!input.trim() ||!active) return; const q = input; setInput(""); setLoading(true)
    const safeTopic = q.replace(/[^a-zA-Z0-9 ]/g, " ").slice(0, 80)
    const diagramUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent("educational diagram of " + safeTopic + ", textbook labeled illustration, white background, clean")}?width=800&height=600&model=flux&seed=${Date.now()}&nologo=true`
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? q.slice(0, 26) : c.title, msgs: [...c.msgs, { q, a: "...", diagram: diagramUrl }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) }); const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply } : m) } : c)); setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui', background: '#fff' }}>
      <div style={{ width: '280px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0' }}>NAWAZ AI ACADEMY</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
        <div style={{ fontSize: '10px', opacity: 0.35, textAlign: 'center' }}>NAWAZ PUBLICATION<br/>Rawalpindi</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ PUBLICATION - NAWAZ AI ACADEMY</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div></div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><ColorfulAnswer text={m.a} /></div>
                {m.diagram && <div style={{ flex: '0 1 300px' }}><img src={m.diagram} style={{ width: '100%', borderRadius: '16px', border: '1px solid #eee' }} alt="diagram" /><div style={{ fontSize: '10px', color: '#999', textAlign: 'center', marginTop: '4px' }}>Diagram: {m.q}</div></div>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '8px 10px', border: '1px solid #e5e7eb' }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer' }}>📎</button>
            <button onClick={startVoice} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#111', color: '#fff', cursor: 'pointer' }}>{isListening? '●' : '🎙️'}</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Class ke sath likhen, ex: Photosynthesis class 2..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={send} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
