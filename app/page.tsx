"use client"
import { useState, useEffect, useRef } from "react"

type Msg = { q: string, a: string, img?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function RenderAnswer({ text }: { text: string }) {
  const clean = text.replace(/\*\*/g, "")
  const match = clean.match(/\[(.*?)\]/s)
  if (match) {
    try {
      const rows = match[1].split(";").map(r => r.trim().split(/\s+/).filter(Boolean))
      return (
        <div>
          <div style={{ display: 'inline-block', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
            {rows.map((row, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {row.map((c, j) => (
                  <div key={j} style={{ padding: '10px 18px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', minWidth: '45px', textAlign: 'center', background: '#fff' }}>{c}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{clean.replace(/\[.*?\]/s, "")}</div>
        </div>
      )
    } catch { }
  }
  return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14.5px' }}>{clean}</div>
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_pro_final")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); const c = { id, title: "New Chat", msgs: [] }; setChats([c]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_pro_final", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats, loading])

  const active = chats.find(c => c.id === activeId)
  function createNew() { const id = Date.now().toString(); const c = { id, title: "New Chat", msgs: [] }; setChats(x => [c,...x]); setActiveId(id) }

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert("Voice ke liye Chrome browser use karein"); return }
    const rec = new SR(); rec.lang = "ur-PK"; rec.interimResults = false
    rec.onstart = () => setIsListening(true)
    rec.onend = () => setIsListening(false)
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript)
    rec.start()
  }

  async function handleFile(e: any) {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = reader.result as string
      const id = Date.now().toString()
      setChats(p => p.map(c => c.id === activeId? {...c, title: "Image Analysis", msgs: [...c.msgs, { q: "Is image ko check karo aur behtar banao", a: "Image mil gayi! NAWAZ AI ACADEMY analysis kar raha hai...", img }] } : c))
      setTimeout(async () => {
        const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: "Is image ko analyse karo aur is se behtar poster ka idea do", hasImage: true }) })
        const d = await res.json()
        setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, img: m.img } : m) } : c))
      }, 500)
    }
    reader.readAsDataURL(file)
  }

  async function send() {
    if (!input.trim() ||!active) return
    const q = input; setInput(""); setLoading(true)

    const lower = q.toLowerCase()
    const isPosterIntent = lower.includes("poster") || lower.includes("پوسٹر") || lower.includes("تصویر") || lower.includes("sahi nahi") || lower.includes("sahe nahi") || lower.includes("dobara") || lower.includes("galat") || lower.includes("theek nahi")

    let imgUrl = ""
    if (isPosterIntent) {
      const prompt = `Premium educational poster for NAWAZ AI ACADEMY, ${q}, modern gradient design, professional, 4k, clean typography, Nawaz Publication Rawalpindi style`
      imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1536&nologo=true&seed=${Date.now()}`
    }

    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? q.slice(0, 28) : c.title, msgs: [...c.msgs, { q, a: "...", img: imgUrl }] } : c))

    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q, hasImage: false }) })
    const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, img: m.img } : m) } : c))
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui', background: '#fff' }}>
      <style>{`@keyframes pulse {0%{box-shadow:0 0 0 0 rgba(255,65,108,0.6)} 70%{box-shadow:0 0 0 10px rgba(255,65,108,0)} 100%{box-shadow:0 0 0 0 rgba(255,65,108,0)}}`}</style>

      <div style={{ width: '280px', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', padding: '14px', borderRight: '1px solid #1f1f1f' }}>
        <div style={{ padding: '12px 0 18px', fontWeight: 900, textAlign: 'center', fontSize: '15px', letterSpacing: '1px' }}>NAWAZ AI ACADEMY</div>
        <button onClick={createNew} style={{ padding: '13px', background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', color: '#fff', borderRadius: '12px', border: '1px solid #2a2a2a', cursor: 'pointer', fontWeight: 600 }}>+ New Chat</button>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: '18px' }}>
          {chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '11px 12px', borderRadius: '10px', cursor: 'pointer', background: activeId === c.id? '#1e1e1e' : 'transparent', fontSize: '13.5px', marginBottom: '6px', border: activeId === c.id? '1px solid #2a2a2a' : '1px solid transparent', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>)}
        </div>
        <div style={{ fontSize: '10px', opacity: 0.4, textAlign: 'center', borderTop: '1px solid #1a1a1a', paddingTop: '12px', lineHeight: '1.5' }}>NAWAZ PUBLICATION<br />Rawalpindi - AI Academy</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '13px', textAlign: 'center', fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px' }}>NAWAZ PUBLICATION - NAWAZ AI ACADEMY - Rawalpindi</div>

        <div style={{ flex: 1, overflowY: 'auto', maxWidth: '860px', width: '100%', margin: '0 auto', padding: '24px 20px 110px' }}>
          {active?.msgs.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '70px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>NAWAZ AI ACADEMY</h1>
              <p style={{ color: '#666', fontSize: '15px' }}>بول کر پوچھیں، پوسٹر بنوائیں، پیپر کی تیاری کریں</p>
              <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {["9th Physics Paper", "Eid Poster Banao", "Photosynthesis kya hai?"].map(t => <button key={t} onClick={() => setInput(t)} style={{ padding: '10px 16px', borderRadius: '9999px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>{t}</button>)}
              </div>
            </div>
          )}
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#111', color: '#fff', padding: '11px 18px', borderRadius: '20px 20px 4px 20px', maxWidth: '78%', fontSize: '14px' }}>{m.q}</div></div>
              {m.img && <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}><img src={m.img} style={{ maxWidth: '380px', width: '100%', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} alt="poster" /></div>}
              <div style={{ background: '#fff', border: '1px solid #efefef', padding: '16px 18px', borderRadius: '16px', marginTop: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}><RenderAnswer text={m.a} /></div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '14px', background: '#fff', borderTop: '1px solid #f0f0f0', position: 'sticky', bottom: 0 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', background: '#f4f4f5', border: '1px solid #e4e7', borderRadius: '9999px', padding: '7px 8px 7px 10px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} title="Poster Upload" style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(102,126,234,0.4)' }}>🖼️</button>
            <button onClick={startVoice} title="Voice" style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: isListening? 'linear-gradient(135deg, #ff416c, #ff4b2b)' : 'linear-gradient(135deg, #0f0f0f, #2a2a2a)', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isListening? 'pulse 1.5s infinite' : 'none', boxShadow: isListening? '0 6px 20px rgba(255,65,108,0.4)' : '0 4px 14px rgba(0,0,0,0.2)' }}>{isListening? '●' : '🎤'}</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="بولیں یا لکھیں..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', padding: '6px' }} />
            <button onClick={send} disabled={loading} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #000, #1a1a1a)', color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.25)', opacity: loading? 0.6 : 1 }}>{loading? '⋯' : '↑'}</button>
          </div>
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#aaa', marginTop: '8px' }}>NAWAZ AI ACADEMY can make mistakes. Check important info.</div>
        </div>
      </div>
    </div>
  )
}
