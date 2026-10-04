"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, diagramTopic: string | null }
type Chat = { id: string, title: string, msgs: Msg[] }

function GeneralDiagram({ topic }: { topic: string }) {
  const t = topic.toLowerCase()

  // 1. PHOTOSYNTHESIS - پروسیس والی
  if (t.includes("photosynthesis")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: '16px', padding: '12px' }}>
        <div style={{ fontWeight: 800, textAlign: 'center', color: '#16a34a' }}>Photosynthesis Process</div>
        <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '10px', marginTop: '8px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontWeight: 700 }}>
            <div>☀️ Sunlight</div><div>💧 H₂O</div><div>🌬️ CO₂</div>
          </div>
          <div style={{ margin: '6px 0' }}>⬇️ ⬇️ ⬇️</div>
          <div style={{ background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '10px', fontWeight: 800 }}>🍃 Leaf - Chlorophyll</div>
          <div style={{ margin: '6px 0' }}>⬇️ ⬇️</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontWeight: 700 }}>
            <div style={{ background: '#fef3c7', padding: '6px 8px', borderRadius: '8px' }}>Glucose<br/>C₆H₁₂O₆</div>
            <div style={{ background: '#dbeafe', padding: '6px 8px', borderRadius: '8px' }}>Oxygen<br/>O₂</div>
          </div>
        </div>
        <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '6px', color: '#16a34a', fontWeight: 700 }}>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</div>
      </div>
    )
  }

  // 2. HEART
  if (t.includes("heart")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
        <div style={{ fontWeight: 800, color: '#ef4444' }}>Human Heart Diagram</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', fontSize: '11px' }}>
          <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '8px' }}><b>Right Atrium</b><br/>→ Deoxygenated blood</div>
          <div style={{ background: '#fecaca', padding: '8px', borderRadius: '8px' }}><b>Left Atrium</b><br/>← Oxygenated blood</div>
          <div style={{ background: '#fecaca', padding: '8px', borderRadius: '8px' }}><b>Right Ventricle</b><br/>→ To Lungs</div>
          <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '8px' }}><b>Left Ventricle</b><br/>→ To Body</div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>❤️ Valves → One way blood flow</div>
      </div>
    )
  }

  // 3. WATER CYCLE
  if (t.includes("water") || t.includes("cycle") || t.includes("evaporation")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
        <div style={{ fontWeight: 800, color: '#0ea5e9' }}>Water Cycle</div>
        <div style={{ background: '#f0f9ff', borderRadius: '12px', padding: '10px', marginTop: '8px', fontSize: '11px', fontWeight: 600 }}>
          <div>☀️ Sun → Evaporation (Sea) ⬆️</div>
          <div style={{ margin: '6px 0' }}>💨 Condensation → Clouds ☁️</div>
          <div>🌧️ Precipitation → Rain → River → Sea</div>
          <div style={{ marginTop: '6px', fontSize: '18px' }}>♻️ Continuous Cycle</div>
        </div>
      </div>
    )
  }

  // 4. CELL - جنرل
  if (t.includes("cell")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #8b5cf6', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
        <div style={{ fontWeight: 800, color: '#8b5cf6' }}>{topic} Structure</div>
        <div style={{ border: '2px dashed #8b5cf6', borderRadius: '50%', padding: '20px', marginTop: '10px', position: 'relative', background: '#faf5ff' }}>
          <div style={{ fontSize: '10px' }}>
            <div>🧬 Nucleus (Center)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span>Mitochondria</span><span>Cytoplasm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span>Cell Membrane</span><span>Vacuole</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 5. باقی ہر ٹاپک کے لیے جنرل آٹو ڈایا گرام - یہی آپ مانگ رہے تھے
  return (
    <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '16px', padding: '12px' }}>
      <div style={{ fontWeight: 800, textAlign: 'center', textTransform: 'capitalize' }}>{topic}</div>
      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <div style={{ background: '#e0f2fe', padding: '6px 10px', borderRadius: '8px', fontWeight: 700 }}>Input</div>
          <div>→</div>
          <div style={{ background: '#111', color: '#fff', padding: '10px 14px', borderRadius: '10px', flex: 1, textAlign: 'center', fontWeight: 800 }}>{topic}</div>
          <div>→</div>
          <div style={{ background: '#dcfce7', padding: '6px 10px', borderRadius: '8px', fontWeight: 700 }}>Output</div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#475569', lineHeight: '1.6' }}>
          ● Definition: {topic} کا بنیادی حصہ<br/>
          ● Process: یہ کیسے کام کرتا ہے<br/>
          ● Function: اس کا کام کیا ہے<br/>
          ● Example: روزمرہ کی مثال
        </div>
      </div>
      <div style={{ fontSize: '9px', textAlign: 'center', color: '#999', marginTop: '6px' }}>Textbook Diagram - NAWAZ ACADEMY TORAWARI</div>
    </div>
  )
}

function ColorfulAnswer({ text }: { text: string }) {
  return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px' }}>
    {text.split("\n").map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '6px' }} />
      if (line.toLowerCase().includes("definition")) return <div key={i} style={{ background: '#f1f5f9', borderLeft: '4px solid #0ea5e9', padding: '6px 10px', borderRadius: '8px', fontWeight: 800 }}>{line}</div>
      if (line.match(/^\d+\./)) return <div key={i} style={{ paddingLeft: '10px', borderLeft: '2px solid #e2e8f0', margin: '4px 0' }}>{line}</div>
      if (line.toLowerCase().includes("example")) return <div key={i} style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '6px 10px', borderRadius: '8px' }}>{line}</div>
      return <div key={i} style={{ color: '#334155' }}>{line}</div>
    })}
  </div>
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_general_v1")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_general_v1", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])
  const active = chats.find(c => c.id === activeId)

  async function send() {
    if (!input.trim() ||!active) return
    const q = input; setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? q.slice(0, 24) : c.title, msgs: [...c.msgs, { q, a: "...", diagramTopic: null }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) })
    const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, diagramTopic: d.needsDiagram? d.diagramType : null } : m) } : c))
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: '260px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0', lineHeight: '1.2' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', textAlign: 'center', marginTop: '10px' }}>NAWAZ ACADEMY<br/>TORAWARI</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI - General AI Tutor</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div></div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><ColorfulAnswer text={m.a} /></div>
                {m.diagramTopic && <div style={{ flex: '0 1 340px' }}><GeneralDiagram topic={m.diagramTopic} /></div>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '8px 10px', border: '1px solid #e5e7eb' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="کوئی بھی ٹاپک لکھیں..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={send} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
