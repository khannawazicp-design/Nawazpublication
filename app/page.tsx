"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramTopic: string | null, image?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function RealDiagram({ topic }: { topic: string }) {
  const t = topic.toLowerCase()
  if (t.includes("photosynthesis")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: '16px', padding: '12px' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', color: '#16a34a' }}>Photosynthesis Process</div>
        <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '10px', marginTop: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 700 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}><span>☀️ Sun</span><span>💧 H₂O</span><span>🌬️ CO₂</span></div>
          <div>⬇️ ⬇️ ⬇️</div>
          <div style={{ background: '#22c55e', color: '#fff', padding: '8px', borderRadius: '8px' }}>🍃 LEAF - Chlorophyll</div>
          <div>⬇️ ⬇️</div>
          <div style={{ display: 'flex', gap: '6px' }}><div style={{ flex: 1, background: '#fef3c7', padding: '6px', borderRadius: '8px' }}>Glucose<br/>C₆H₁₂O₆</div><div style={{ flex: 1, background: '#dbeafe', padding: '6px', borderRadius: '8px' }}>Oxygen<br/>O₂</div></div>
          <div style={{ fontSize: '10px', marginTop: '6px', color: '#16a34a' }}>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</div>
        </div>
      </div>
    )
  }
  if (t.includes("heart")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
        <div style={{ fontWeight: 800, color: '#ef4444' }}>Human Heart - Labeled</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px', fontSize: '11px' }}>
          <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '8px' }}><b>Right Atrium</b><br/>Deoxygenated</div>
          <div style={{ background: '#fecaca', padding: '8px', borderRadius: '8px' }}><b>Left Atrium</b><br/>Oxygenated</div>
          <div style={{ background: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px' }}><b>Right Ventricle</b><br/>→ Lungs</div>
          <div style={{ background: '#b91c1c', color: '#fff', padding: '10px', borderRadius: '8px' }}><b>Left Ventricle</b><br/>→ Body</div>
        </div>
        <div style={{ fontSize: '9px', color: '#999', marginTop: '6px' }}>NAWAZ ACADEMY TORAWARI</div>
      </div>
    )
  }
  if (t.includes("water") || t.includes("cycle")) {
    return <div style={{ background: '#fff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '12px', textAlign: 'center' }}><div style={{ fontWeight: 800, color: '#0ea5e9' }}>Water Cycle</div><div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '10px', marginTop: '8px', fontSize: '11px', fontWeight: 600 }}>☀️ Evaporation ⬆️<br/>☁️ Condensation<br/>🌧️ Precipitation<br/>♻️ Cycle</div></div>
  }
  if (t.includes("cell")) {
    return <div style={{ background: '#fff', border: '2px solid #8b5cf6', borderRadius: '16px', padding: '12px', textAlign: 'center' }}><div style={{ fontWeight: 800, color: '#8b5cf6' }}>{topic} Diagram</div><div style={{ border: '2px dashed #8b5cf6', borderRadius: '50%', padding: '20px', marginTop: '8px', background: '#faf5ff', fontSize: '10px' }}>Nucleus - Control Center<br/><br/>Mitochondria | Cytoplasm | Vacuole<br/>Cell Membrane | Cell Wall</div></div>
  }
  return <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '16px', padding: '12px' }}><div style={{ fontWeight: 800, textAlign: 'center', textTransform: 'capitalize' }}>{topic}</div><div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px', marginTop: '8px', fontSize: '11px' }}>📚 Input → <b>{topic}</b> Process → Output<br/><br/>● Definition<br/>● Function<br/>● Example</div><div style={{ fontSize: '9px', textAlign: 'center', color: '#999', marginTop: '6px' }}>NAWAZ ACADEMY TORAWARI</div></div>
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
    const s = localStorage.getItem("nawaz_final_all_in_one")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_all_in_one", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])

  const active = chats.find(c => c.id === activeId)

  async function send(msg?: string) {
    const q = msg || input
    if (!q.trim() &&!imageBase64) return
    const finalQ = q || "Is tasveer ko explain karo"
    setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? finalQ.slice(0, 24) : c.title, msgs: [...c.msgs, { q: finalQ, a: "...", diagramTopic: null, image: preview || undefined }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: finalQ, image: imageBase64 }) })
    const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, diagramTopic: d.needsDiagram? d.diagramType : null } : m) } : c))
    setPreview(null); setImageBase64(null); setLoading(false)
  }

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) { alert("Voice is browser mein supported nahi"); return }
    const rec = new SR()
    rec.lang = "ur-PK"; rec.onstart = () => setIsListening(true); rec.onend = () => setIsListening(false)
    rec.onresult = (e: any) => { const txt = e.results[0][0].transcript; send(txt) }
    rec.start()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: '260px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
        <div style={{ fontSize: '12px', fontWeight: 800, textAlign: 'center' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                {m.image && <img src={m.image} style={{ width: '120px', borderRadius: '12px', marginBottom: '6px', border: '1px solid #eee' }} />}
                <div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div>
              </div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.7' }}>{m.a}</div>
                {m.diagramTopic && <div style={{ flex: '0 1 320px' }}><RealDiagram topic={m.diagramTopic} /></div>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          {preview && <div style={{ maxWidth: '860px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', gap: '8px' }}><img src={preview} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} /><span style={{ fontSize: '12px' }}>Image ready</span><button onClick={() => { setPreview(null); setImageBase64(null) }} style={{ marginLeft: 'auto', background: '#fee2e2', border: 'none', padding: '4px 8px', borderRadius: '6px' }}>X</button></div>}
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '8px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '6px 8px', border: '1px solid #e5e7eb' }}>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const reader = new FileReader(); reader.onload = () => { const b64 = reader.result as string; setImageBase64(b64); setPreview(b64); }; reader.readAsDataURL(file);
            }} />
            <button onClick={() => fileRef.current?.click()} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer' }}>📷</button>
            <button onClick={startVoice} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#fff', color: isListening? '#fff' : '#111', cursor: 'pointer' }}>🎙️</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={isListening? "Sun raha hoon..." : "Sawal likhein, bolein ya tasveer lagayein..."} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={() => send()} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
