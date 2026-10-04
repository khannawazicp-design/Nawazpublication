"use client"
import { useState, useEffect, useRef } from "react"

type Msg = { q: string, a: string, diagramTopic: string | null }
type Chat = { id: string, title: string, msgs: Msg[] }

// یہ اندر کی بنی ہوئی ڈایا گرام ہے، کبھی نہیں ٹوٹے گی
function RealDiagram({ topic }: { topic: string }) {
  const t = topic.toLowerCase()

  if (t.includes("photosynthesis")) {
    return (
      <div style={{ background: '#fff', border: '2px solid #16a34a', borderRadius: '16px', padding: '12px' }}>
        <div style={{ fontWeight: 800, textAlign: 'center', color: '#16a34a', marginBottom: '8px' }}>Photosynthesis Process</div>
        <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontWeight: 700 }}>
            <div>☀️ Sunlight<br/><span style={{ color: '#f59e0b' }}>→ Light Energy</span></div>
            <div>💧 Water<br/><span style={{ color: '#0ea5e9' }}>From Roots</span></div>
            <div>🌬️ CO₂<br/><span style={{ color: '#6b7280' }}>From Air</span></div>
          </div>
          <div style={{ fontSize: '20px', margin: '8px 0' }}>⬇️ ⬇️ ⬇️</div>
          <div style={{ background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '10px', fontWeight: 800 }}>
            🍃 LEAF (Chloroplast) <br/> Chlorophyll
          </div>
          <div style={{ fontSize: '20px', margin: '8px 0' }}>⬇️ ⬇️</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px', fontWeight: 700 }}>
            <div style={{ background: '#fef3c7', padding: '6px 10px', borderRadius: '8px' }}>🍯 Glucose<br/>C₆H₁₂O₆<br/>(Food)</div>
            <div style={{ background: '#dbeafe', padding: '6px 10px', borderRadius: '8px' }}>💨 Oxygen<br/>O₂<br/>(For Breathing)</div>
          </div>
        </div>
        <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '6px', color: '#16a34a', fontWeight: 700 }}>6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂</div>
        <div style={{ fontSize: '9px', textAlign: 'center', color: '#999', marginTop: '4px' }}>Real Textbook Diagram - NAWAZ ACADEMY TORAWARI</div>
      </div>
    )
  }

  // باقی ٹاپکس کے لیے جنرل ڈایا گرام
  return (
    <div style={{ background: '#fff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
      <div style={{ fontWeight: 800, color: '#0ea5e9', textTransform: 'capitalize' }}>{topic} - Labeled Diagram</div>
      <div style={{ marginTop: '10px', background: '#f0f9ff', padding: '20px', borderRadius: '12px', fontSize: '13px', color: '#334155' }}>
        📚 Textbook diagram for <b>{topic}</b><br/>
        (Detailed labeled structure will appear here)
      </div>
      <div style={{ fontSize: '9px', color: '#999', marginTop: '6px' }}>NAWAZ ACADEMY TORAWARI</div>
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
    const s = localStorage.getItem("nawaz_final_fixed")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_fixed", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])

  const active = chats.find(c => c.id === activeId)

  async function send() {
    if (!input.trim() ||!active) return
    const q = input; setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? q.slice(0, 24) : c.title, msgs: [...c.msgs, { q, a: "...", diagramTopic: null }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) })
    const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, diagramTopic: d.needsDiagram? q : null } : m) } : c))
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
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ ACADEMY TORAWARI</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div></div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><ColorfulAnswer text={m.a} /></div>
                {m.diagramTopic && <div style={{ flex: '0 1 320px' }}><RealDiagram topic={m.diagramTopic} /></div>}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '8px 10px', border: '1px solid #e5e7eb' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Search..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={send} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
