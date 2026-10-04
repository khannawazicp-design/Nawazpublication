"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramType: string | null, image?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function RealDiagram({ type }: { type: string }) {
  const t = (type || "").toLowerCase()
  if (t.includes("force")) {
    return <div style={{ background: '#fff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '14px' }}><div style={{ fontWeight: 900, textAlign: 'center', color: '#0ea5e9' }}>Force - F = m × a</div><div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '10px', marginTop: '8px', fontSize: '11px', textAlign: 'center', fontWeight: 700 }}>Box → 10 N → 2 m/s²</div></div>
  }
  return <div style={{ background: '#fff', border: '2px solid #8b5cf6', borderRadius: '16px', padding: '12px', textAlign: 'center', fontWeight: 900, color: '#8b5cf6' }}>{type} Diagram</div>
}

function MathText({ text }: { text: string }) {
  let clean = text.replace(/\\\[/g, "\n").replace(/\\\]/g, "\n").replace(/\\\(/g, "").replace(/\\\)/g, "").replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)").replace(/\\lim_\{h\\to 0\}/g, "lim h→0 ").replace(/\\to/g, "→").replace(/\\text\{([^}]+)\}/g, "$1").replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/\*\*/g, "");

  const lines = clean.split("\n");
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', fontSize: '14.5px' }}>
      {lines.map((line, idx) => {
        const lower = line.toLowerCase();
        let style: any = { color: '#334155', margin: '6px 0' };
        if (lower.includes("definition")) style = { color: '#7c3aed', fontWeight: 900, fontSize: '16px', background: '#f5f3ff', padding: '6px 12px', borderRadius: '8px', borderLeft: '4px solid #7c3aed' };
        else if (lower.includes("concept")) style = { color: '#0ea5e9', fontWeight: 900, fontSize: '16px', background: '#f0f9ff', padding: '6px 12px', borderRadius: '8px', borderLeft: '4px solid #0ea5e9' };
        else if (lower.includes("formula") || lower.includes("process")) style = { color: '#16a34a', fontWeight: 900, fontSize: '16px', background: '#f0fdf4', padding: '6px 12px', borderRadius: '8px', borderLeft: '4px solid #16a34a' };
        else if (lower.includes("example")) style = { color: '#ea580c', fontWeight: 900, fontSize: '16px', background: '#fff7ed', padding: '6px 12px', borderRadius: '8px', borderLeft: '4px solid #ea580c' };
        else if (lower.includes("importance") || lower.includes("summary")) style = { color: '#dc2626', fontWeight: 900, fontSize: '16px', background: '#fef2f2', padding: '6px 12px', borderRadius: '8px', borderLeft: '4px solid #dc2626' };

        const parts = line.split(/(\$[^$]+\$)/g);
        return (
          <div key={idx} style={style}>
            {parts.map((p, i) => {
              if (p.startsWith("$") && p.endsWith("$")) {
                return <span key={i} style={{ background: 'linear-gradient(90deg,#eef2ff,#e0e7ff)', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: '10px', fontWeight: 800, margin: '2px', display: 'inline-block', color: '#1e1b4b' }}>{p.replaceAll("$","")}</span>;
              }
              return <span key={i}>{p}</span>;
            })}
          </div>
        );
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
    const s = localStorage.getItem("nawaz_colorful_final")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_colorful_final", JSON.stringify(chats)) }, [chats])
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

  function handleVoiceClick() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert("Chrome mein kholein"); return }
    if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); return }
    const rec = new SR()
    recognitionRef.current = rec
    rec.lang = "en-US"; rec.continuous = false; rec.interimResults = true
    rec.onstart = () => setIsListening(true)
    rec.onend = () => { setIsListening(false); recognitionRef.current = null }
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      if (e.results[0].isFinal) { setIsListening(false); if (transcript.trim()) send(transcript) }
      else { setInput(transcript) }
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
        {isListening && <div style={{ background: '#000', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, marginRight: '10px' }}>● Recording...</span><div style={{ display: 'flex', gap: '3px' }}>{[...Array(20)].map((_, i) => <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, background: '#22c55e', borderRadius: '10px' }} />)}</div></div>}
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m,i)=>(
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                {m.image && <img src={m.image} style={{ width: '120px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #eee' }} />}
                <div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}><MathText text={m.a} /></div>
                {m.diagramType && <div style={{ flex: '0 1 320px' }}><RealDiagram type={m.diagramType} /></div>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          {preview && <div style={{ maxWidth: '860px', margin: '0 auto 8px', display: 'flex', gap: '8px', alignItems: 'center' }}><img src={preview} style={{ width: '50px', height: '50px', borderRadius: '8px' }} /><span style={{ fontSize: '12px' }}>Image ready</span><button onClick={()=>{setPreview(null); setImageBase64(null)}} style={{ marginLeft: 'auto', background: '#fee2e2', border: 'none', padding: '4px 8px', borderRadius: '6px' }}>X</button></div>}
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', background: isListening? '#fef2f2' : '#f4f4f5', borderRadius: '9999px', padding: '6px 8px', border: '1px solid #e5e7eb' }}>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ setImageBase64(r.result as string); setPreview(r.result as string); }; r.readAsDataURL(file); }} />
            <button onClick={()=>fileRef.current?.click()} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer' }}>📷</button>
            <button onClick={handleVoiceClick} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#111', color: '#fff', cursor: 'pointer' }}>{isListening? '■' : '🎙️'}</button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} placeholder={isListening? "سن رہا ہوں..." : "سوال لکھیں، بولیں یا تصویر لگائیں..."} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={()=>send()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
