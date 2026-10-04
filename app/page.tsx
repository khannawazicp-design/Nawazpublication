"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramType: string | null, image?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function RealDiagram({ type }: { type: string }) {
  const t = (type || "").toLowerCase()
  if (t.includes("kidney") || t.includes("gurda") || t.includes("kindny")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #f97316', borderRadius: '16px', padding: '14px' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', color: '#f97316', fontSize: '14px' }}>Human Kidney - Labeled Diagram</div>
        <div style={{ marginTop: '10px' }}>
          <svg viewBox="0 0 200 160" style={{ width: '100%', height: 'auto' }}>
            <path d="M 80 20 C 110 10, 140 30, 135 70 C 130 110, 100 140, 70 130 C 40 120, 30 90, 50 50 Z" fill="#fef3c7" stroke="#f97316" strokeWidth="2"/>
            <path d="M 90 40 C 110 45, 120 70, 110 95 C 100 115, 80 120, 65 105" fill="#fff7ed" stroke="#fb923c" strokeWidth="1.5"/>
            <text x="105" y="30" fontSize="8" fontWeight="700" fill="#c2410c">Cortex</text>
            <text x="105" y="75" fontSize="8" fontWeight="700" fill="#c2410c">Medulla</text>
            <text x="70" y="110" fontSize="7" fontWeight="600" fill="#9a3412">Renal Pelvis</text>
            <rect x="50" y="125" width="60" height="12" rx="6" fill="#fed7aa" stroke="#f97316"/>
            <text x="80" y="133" fontSize="7" textAnchor="middle" fontWeight="700">Ureter</text>
          </svg>
          <div style={{ fontSize: '10px', lineHeight: '1.6', background: '#fff7ed', padding: '8px', borderRadius: '8px', marginTop: '6px' }}>
            <b>1. Renal Cortex:</b> Outer part - filtration starts<br/>
            <b>2. Renal Medulla:</b> Inner part - concentration<br/>
            <b>3. Nephron:</b> 1 Million filter units<br/>
            <b>4. Renal Pelvis:</b> Collects urine<br/>
            <b>5. Ureter:</b> Takes urine to bladder
          </div>
        </div>
        <div style={{ fontSize: '8px', textAlign: 'center', color: '#999', marginTop: '6px' }}>NAWAZ ACADEMY TORAWARI</div>
      </div>
    )
  }
  if (t.includes("photo")) {
    return <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: '16px', padding: '12px' }}><div style={{ fontWeight: 900, textAlign: 'center', color: '#16a34a' }}>Photosynthesis Process</div><div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '10px', marginTop: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 700 }}><div style={{ display: 'flex', justifyContent: 'space-around' }}><span>☀️ Sun</span><span>💧 H₂O</span><span>🌬️ CO₂</span></div><div>⬇️</div><div style={{ background: '#22c55e', color: '#fff', padding: '8px', borderRadius: '8px' }}>🍃 LEAF - Chlorophyll</div><div>⬇️</div><div style={{ display: 'flex', gap: '6px' }}><div style={{ flex: 1, background: '#fef3c7', padding: '6px', borderRadius: '8px' }}>Glucose</div><div style={{ flex: 1, background: '#dbeafe', padding: '6px', borderRadius: '8px' }}>O₂</div></div></div></div>
  }
  if (t.includes("heart")) {
    return <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: '16px', padding: '12px', textAlign: 'center' }}><div style={{ fontWeight: 900, color: '#ef4444' }}>Human Heart</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px', fontSize: '11px' }}><div style={{ background: '#fee2e2', padding: '8px', borderRadius: '8px' }}><b>Right Atrium</b></div><div style={{ background: '#fecaca', padding: '8px', borderRadius: '8px' }}><b>Left Atrium</b></div><div style={{ background: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px' }}><b>Right Ventricle</b></div><div style={{ background: '#b91c1c', color: '#fff', padding: '10px', borderRadius: '8px' }}><b>Left Ventricle</b></div></div></div>
  }
  if (t.includes("cell")) {
    return <div style={{ background: '#fff', border: '2px solid #8b5cf6', borderRadius: '16px', padding: '12px', textAlign: 'center' }}><div style={{ fontWeight: 900, color: '#8b5cf6' }}>Cell Structure</div><div style={{ border: '2px dashed #8b5cf6', borderRadius: '12px', padding: '12px', marginTop: '8px', background: '#faf5ff', fontSize: '11px' }}>Cell Membrane<br/>Nucleus<br/>Mitochondria<br/>Vacuole</div></div>
  }
  return <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '16px', padding: '12px' }}><div style={{ fontWeight: 800, textAlign: 'center' }}>{type}</div><div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginTop: '8px', fontSize: '11px' }}>📚 {type} Diagram</div></div>
}

function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$.*?\$)/g)
  return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px' }}>{parts.map((p,i)=> p.startsWith("$") && p.endsWith("$")? <span key={i} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>{p.replaceAll("$","")}</span> : <span key={i}>{p}</span>)}</div>
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
    const s = localStorage.getItem("nawaz_fixed_v4_final")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_fixed_v4_final", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])
  const active = chats.find(c => c.id === activeId)

  async function send(msg?: string) {
    const q = msg || input
    if (!q.trim() &&!imageBase64) return
    const finalQ = q || "Explain this image"
    setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? finalQ.slice(0, 24) : c.title, msgs: [...c.msgs, { q: finalQ, a: "...", diagramType: null, image: preview || undefined }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: finalQ, image: imageBase64 }) })
    const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a: d.reply, diagramType: d.needsDiagram? d.diagramType : null } : m) } : c))
    setPreview(null); setImageBase64(null); setLoading(false)
  }

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert("Chrome mein kholein"); return }
    const rec = new SR()
    rec.lang = "en-US"; rec.onstart = () => setIsListening(true); rec.onend = () => setIsListening(false)
    rec.onresult = (e: any) => { const txt = e.results[0][0].transcript; setIsListening(false); send(txt) }
    rec.start()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: '260px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m,i)=>(
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                {m.image && <img src={m.image} style={{ width: '120px', borderRadius: '12px', marginBottom: '6px' }} />}
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
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '6px 8px', border: '1px solid #e5e7eb' }}>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e)=>{ const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ setImageBase64(r.result as string); setPreview(r.result as string); }; r.readAsDataURL(file); }} />
            <button onClick={()=>fileRef.current?.click()} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer' }}>📷</button>
            <button onClick={startVoice} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#fff', cursor: 'pointer' }}>🎙️</button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} placeholder={isListening? "Sun raha hoon..." : "Sawal likhein, bolein ya tasveer lagayein..."} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={()=>send()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
