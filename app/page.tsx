"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramType: string | null, image?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function RealDiagram({ type }: { type: string }) {
  const t = (type || "").toLowerCase()
  if (t.includes("force") || t.includes("newton")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '14px' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', color: '#0ea5e9' }}>Force - F = m × a</div>
        <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '10px', marginTop: '8px', fontSize: '11px', textAlign: 'center', fontWeight: 700 }}>
          Box (5 kg) → Force 10 N → Acceleration 2 m/s²<br/>
          <span style={{ color: '#0ea5e9' }}>F = m × a | Unit = kg·m/s² = N (Newton)</span>
        </div>
        <div style={{ fontSize: '8px', textAlign: 'center', color: '#999', marginTop: '6px' }}>NAWAZ ACADEMY TORAWARI</div>
      </div>
    )
  }
  if (t.includes("kidney") || t.includes("gurda")) {
    return <div style={{ background: '#fff', border: '2px solid #f97316', borderRadius: '16px', padding: '14px' }}><div style={{ fontWeight: 900, textAlign: 'center', color: '#f97316' }}>Human Kidney</div><div style={{ fontSize: '11px', background: '#fff7ed', padding: '8px', borderRadius: '8px', marginTop: '8px', lineHeight: '1.6' }}><b>Cortex:</b> Outer filtration<br/><b>Medulla:</b> Inner part<br/><b>Nephron:</b> 1 Million filters<br/><b>Ureter:</b> To bladder</div></div>
  }
  if (t.includes("photo")) {
    return <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: '16px', padding: '12px' }}><div style={{ fontWeight: 900, textAlign: 'center', color: '#16a34a' }}>Photosynthesis</div><div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '8px', marginTop: '8px', fontSize: '11px', textAlign: 'center' }}>☀️ + 💧 H₂O + 🌬️ CO₂ → 🍃 Leaf → Glucose + O₂<br/><span style={{ color: '#16a34a', fontWeight: 700 }}>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</span></div></div>
  }
  if (t.includes("heart")) {
    return <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: '16px', padding: '12px', textAlign: 'center' }}><div style={{ fontWeight: 900, color: '#ef4444' }}>Human Heart - 4 Chambers</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px', fontSize: '11px' }}><div style={{ background: '#fee2e2', padding: '8px', borderRadius: '8px' }}>Right Atrium</div><div style={{ background: '#fecaca', padding: '8px', borderRadius: '8px' }}>Left Atrium</div><div style={{ background: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px' }}>Right Ventricle</div><div style={{ background: '#b91c1c', color: '#fff', padding: '10px', borderRadius: '8px' }}>Left Ventricle</div></div></div>
  }
  if (t.includes("cell")) {
    return <div style={{ background: '#fff', border: '2px solid #8b5cf6', borderRadius: '16px', padding: '12px', textAlign: 'center' }}><div style={{ fontWeight: 900, color: '#8b5cf6' }}>Cell Structure</div><div style={{ border: '2px dashed #8b5cf6', borderRadius: '12px', padding: '12px', marginTop: '8px', background: '#faf5ff', fontSize: '11px' }}>Cell Membrane<br/>Nucleus (Control)<br/>Mitochondria (Powerhouse)<br/>Vacuole</div></div>
  }
  return <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '16px', padding: '12px' }}><div style={{ fontWeight: 800, textAlign: 'center' }}>{type}</div></div>
}

function MathText({ text }: { text: string }) {
  let clean = text.replace(/\\text\{([^}]+)\}/g, "$1").replace(/\\,/g, " ").replace(/\\times/g, " × ").replace(/\*\*/g, "");
  const matrixRegex = /\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g;
  clean = clean.replace(matrixRegex, (match, inner) => {
    const rows = inner.trim().split("\\\\");
    let html = `<div style="display:inline-block; vertical-align:middle; border-left:2px solid #111; border-right:2px solid #111; border-radius:8px; padding:4px 12px; margin:4px 6px; background:#f8fafc;">`;
    rows.forEach((row: string) => {
      const cols = row.split("&");
      html += `<div style="display:flex; gap:20px; justify-content:center;">`;
      cols.forEach((col: string) => { html += `<span style="min-width:20px; text-align:center; font-weight:700;">${col.trim()}</span>`; });
      html += `</div>`;
    });
    html += `</div>`;
    return `__MATRIX_START__${html}__MATRIX_END__`;
  });

  const parts = clean.split(/(\$[^$]+\$|__MATRIX_START__[\s\S]*?__MATRIX_END__)/g);
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', fontSize: '14.5px', color: '#1e293b' }}>
      {parts.map((p, i) => {
        if (p.startsWith("__MATRIX_START__")) {
          const html = p.replace("__MATRIX_START__", "").replace("__MATRIX_END__", "");
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        if (p.startsWith("$") && p.endsWith("$")) {
          let inside = p.replaceAll("$", "").trim().replace(/\^2/g, "²").replace(/\^3/g, "³");
          const isEq = inside.includes("=") || inside.includes("×");
          return <span key={i} style={{ background: isEq? '#eef2ff' : '#f1f5f9', border: isEq? '1px solid #c7d2fe' : '1px solid #e2e8f0', padding: '3px 10px', borderRadius: '8px', fontFamily: 'serif', fontWeight: 800, color: '#1e1b4b', display: 'inline-block', margin: '2px' }}>{inside}</span>;
        }
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

  useEffect(() => {
    const s = localStorage.getItem("nawaz_final_full_v5")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_full_v5", JSON.stringify(chats)) }, [chats])
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
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI - AI Tutor</div>
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
