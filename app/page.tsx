"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramType: string | null, image?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function RealDiagram({ type }: { type: string }) {
  const t = (type || "").toLowerCase()
  if (t.includes("force")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '14px' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', color: '#0ea5e9' }}>Force - F = m × a</div>
        <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '10px', marginTop: '8px', fontSize: '11px', textAlign: 'center', fontWeight: 700 }}>Box → Force 10 N → 2 m/s²</div>
      </div>
    )
  }
  if (t.includes("kidney")) return <div style={{ background: '#fff', border: '2px solid #f97316', borderRadius: '16px', padding: '14px', textAlign: 'center', fontWeight: 900, color: '#f97316' }}>Human Kidney Diagram</div>
  if (t.includes("photo")) return <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: '16px', padding: '12px', textAlign: 'center', fontWeight: 900, color: '#16a34a' }}>Photosynthesis</div>
  if (t.includes("heart")) return <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: '16px', padding: '12px', textAlign: 'center', fontWeight: 900, color: '#ef4444' }}>Heart - 4 Chambers</div>
  return <div style={{ background: '#fff', border: '2px solid #8b5cf6', borderRadius: '16px', padding: '12px', textAlign: 'center', fontWeight: 900, color: '#8b5cf6' }}>{type}</div>
}

function MathText({ text }: { text: string }) {
  let clean = text.replace(/\\\[/g, "\n").replace(/\\\]/g, "\n").replace(/\\\(/g, "").replace(/\\\)/g, "").replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)").replace(/\\lim_\{h\\to 0\}/g, "lim h→0 ").replace(/\\to/g, "→").replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/\*\*/g, "");
  const parts = clean.split(/(\$[^$]+\$)/g);
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2.1', fontSize: '14.5px' }}>
      {parts.map((p, i) => {
        if (p.startsWith("$") && p.endsWith("$")) return <span key={i} style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: '10px', fontWeight: 800, margin: '2px', display: 'inline-block' }}>{p.replaceAll("$","")}</span>;
        return <span key={i}>{p}</span>;
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
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_final_v7")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_v7", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])
  const active = chats.find(c => c.id === activeId)

  async function send(msg?: string) {
    const q = msg || input
    if (!q.trim() &&!imageBase64) return
    const finalQ = q || "Explain this image"
    setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? finalQ.slice(0, 24) : c.title, msgs: [...c.msgs, { q: finalQ, a: "...", diagramType: null, image: preview || undefined }] } : c))
    try {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: finalQ, image: imageBase64 }) })
      const d = await res.json()
      setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a: d.reply, diagramType: d.needsDiagram? d.diagramType : null } : m) } : c))
    } catch { setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a: "Connection error"} : m) } : c)) }
    setPreview(null); setImageBase64(null); setLoading(false)
  }

  // --- PROFESSIONAL VOICE BUTTON FIX ---
  function handleVoiceClick() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert("براہ کرم Chrome Browser میں کھولیں، وائس وہاں کام کرتی ہے"); return }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const rec = new SR()
    recognitionRef.current = rec
    rec.lang = "en-US"
    rec.continuous = false
    rec.interimResults = true

    rec.onstart = () => { setIsListening(true) }
    rec.onend = () => { setIsListening(false); recognitionRef.current = null }
    rec.onerror = () => { setIsListening(false) }
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      if (e.results[0].isFinal) {
        setIsListening(false)
        if (transcript.trim()) {
          send(transcript)
        }
      } else {
        setInput(transcript)
      }
    }
    rec.start()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: '260px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI</div>

        {/* Voice Recording Line */}
        {isListening && (
          <div style={{ background: '#000', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, marginRight: '10px' }}>● Recording...</span>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              {[...Array(20)].map((_, i) => (
                <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, background: '#22c55e', borderRadius: '10px', animation: `wave ${0.5 + Math.random()}s infinite` }} />
              ))}
            </div>
            <style>{`@keyframes wave { 0%,100%{height:10px} 50%{height:25px} }`}</style>
            <span style={{ color: '#aaa', fontSize: '11px', marginLeft: '10px' }}>دوبارہ کلک کریں تو بھیجے گا</span>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m,i)=>(
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                {m.image && <img src={m.image} style={{ width: '120px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #eee' }} />}
                <div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><MathText text={m.a} /></div>
                {m.diagramType && <div style={{ flex: '0 1 320px' }}><RealDiagram type={m.diagramType} /></div>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          {preview && <div style={{ maxWidth: '860px', margin: '0 auto 8px', display: 'flex', gap: '8px', alignItems: 'center' }}><img src={preview} style={{ width: '50px', height: '50px', borderRadius: '8px' }} /><span style={{ fontSize: '12px' }}>Image ready</span><button onClick={()=>{setPreview(null); setImageBase64(null)}} style={{ marginLeft: 'auto', background: '#fee2e2', border: 'none', padding: '4px 8px', borderRadius: '6px' }}>X</button></div>}

          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', background: isListening? '#fef2f2' : '#f4f4f5', borderRadius: '9999px', padding: '6px 8px', border: isListening? '1px solid #fecaca' : '1px solid #e5e7eb', transition: '0.3s' }}>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ setImageBase64(r.result as string); setPreview(r.result as string); }; r.readAsDataURL(file); }} />
            <button onClick={()=>fileRef.current?.click()} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>📷</button>

            {/* PROFESSIONAL MIC BUTTON */}
            <button onClick={handleVoiceClick} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#111', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', boxShadow: isListening? '0 0 0 6px #fecaca' : 'none' }}>
              {isListening? '■' : '🎙️'}
            </button>

            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} placeholder={isListening? "سن رہا ہوں... بولیں" : "سوال لکھیں، بولیں یا تصویر لگائیں..."} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: isListening? '#b91c1c' : '#111' }} />
            <button onClick={()=>send()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
