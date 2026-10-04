"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramPrompt: string | null, image?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$.*?\$)/g);
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9', fontSize: '15px', color: '#1e293b' }}>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          return <span key={i} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '6px', fontFamily: 'serif', fontWeight: 700, border: '1px solid #e2e8f0' }}>{part.replaceAll("$","")}</span>
        }
        if (part.toLowerCase().includes("definition")) return <div key={i} style={{ background: '#f1f5f9', borderLeft: '4px solid #0ea5e9', padding: '6px 10px', borderRadius: '8px', fontWeight: 800, margin: '6px 0' }}>{part}</div>
        return <span key={i}>{part}</span>
      })}
    </div>
  )
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_academy_final_all")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_academy_final_all", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])
  const active = chats.find(c => c.id === activeId)

  async function send(msg?: string) {
    const q = msg || input
    if (!q.trim() &&!imageBase64) return
    const finalQ = q || "Is tasveer ko explain karo"
    setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? finalQ.slice(0, 24) : c.title, msgs: [...c.msgs, { q: finalQ, a: "...", diagramPrompt: null, image: preview || undefined }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: finalQ, image: imageBase64 }) })
    const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, diagramPrompt: d.needsDiagram? d.diagramPrompt : null } : m) } : c))
    setPreview(null); setImageBase64(null); setLoading(false)
  }

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert("Voice Chrome browser mein kaam karta hai"); return }
    if (isListening) return
    const rec = new SR()
    rec.lang = "en-US"
    rec.onstart = () => setIsListening(true)
    rec.onend = () => setIsListening(false)
    rec.onerror = () => setIsListening(false)
    rec.onresult = (e: any) => {
      const txt = e.results[0][0].transcript
      setIsListening(false)
      send(txt)
    }
    rec.start()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: '260px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0', lineHeight: '1.2' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
        <div style={{ fontSize: '11px', fontWeight: 800, textAlign: 'center', color: '#aaa' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI - AI Tutor</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                {m.image && <img src={m.image} style={{ width: '140px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #eee' }} alt="upload" />}
                <div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 360px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><MathText text={m.a} /></div>
                {m.diagramPrompt && (
                  <div style={{ flex: '0 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '8px' }}>
                    <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(m.diagramPrompt + ", textbook labeled diagram white background educational clear")}?width=1024&height=1024&model=flux&nologo=true&seed=${i}`} style={{ width: '100%', borderRadius: '12px', background: '#fff' }} alt="diagram" />
                    <div style={{ fontSize: '10px', textAlign: 'center', color: '#666', marginTop: '6px' }}>{m.diagramPrompt}<br/>NAWAZ ACADEMY TORAWARI</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          {preview && <div style={{ maxWidth: '860px', margin: '0 auto 8px', display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '6px', borderRadius: '10px' }}><img src={preview} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} /><span style={{ fontSize: '12px' }}>Image ready for explain</span><button onClick={() => { setPreview(null); setImageBase64(null) }} style={{ marginLeft: 'auto', background: '#fee2e2', border: 'none', padding: '4px 8px', borderRadius: '6px' }}>X</button></div>}
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '6px 8px', border: '1px solid #e5e7eb' }}>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const r = new FileReader(); r.onload = () => { const b64 = r.result as string; setImageBase64(b64); setPreview(b64); }; r.readAsDataURL(file); }} />
            <button onClick={() => fileRef.current?.click()} style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '18px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#ddd' }} title="Picture Upload">📷</button>
            <button onClick={startVoice} style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#fff', color: isListening? '#fff' : '#111', cursor: 'pointer', fontSize: '18px', border: '1px solid #ddd' }} title="Voice">🎙️</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={isListening? "Sun raha hoon..." : "Sawal likhein, bolein ya tasveer lagayein..."} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={() => send()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
