"use client"
import { useState, useEffect, useRef } from "react"

type Msg = { q: string, a: string, diagram: string }
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

function makeDiagram(topic: string) {
  const t = topic.toLowerCase()
  let svg = ""
  if (t.includes("photo")) {
    svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='white'/><text x='300' y='40' text-anchor='middle' font-size='24' font-weight='bold' fill='#0f172a'>Photosynthesis</text><circle cx='120' cy='120' r='45' fill='#fde047' stroke='#eab308' stroke-width='3'/><text x='120' y='125' text-anchor='middle' font-size='12' font-weight='bold'>SUN</text><path d='M200 180 L300 180 L300 220 L200 220 Z' fill='#bbf7d0' stroke='#16a34a' stroke-width='2'/><text x='250' y='205' text-anchor='middle' font-size='11'>LEAF</text><text x='300' y='280' text-anchor='middle' font-size='13'>CO2 + H2O → Glucose + O2</text><text x='300' y='310' text-anchor='middle' font-size='12' fill='#15803d'>6CO2 + 6H2O → C6H12O6 + 6O2</text><text x='300' y='380' text-anchor='middle' font-size='10' fill='#94a3b8'>NAWAZ AI ACADEMY</text></svg>`
  } else if (t.includes("heart")) {
    svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='white'/><text x='300' y='40' text-anchor='middle' font-size='24' font-weight='bold'>Human Heart</text><path d='M300 120 C 220 60, 120 140, 300 300 C 480 140, 380 60, 300 120' fill='#fecaca' stroke='#dc2626' stroke-width='3'/><text x='190' y='180' font-size='12'>Left Atrium</text><text x='350' y='180' font-size='12'>Right Atrium</text><text x='190' y='250' font-size='12'>Left Ventricle</text><text x='350' y='250' font-size='12'>Right Ventricle</text></svg>`
  } else if (t.includes("cell") || t.includes("bacteria")) {
    svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='white'/><text x='300' y='40' text-anchor='middle' font-size='22' font-weight='bold'>Cell Structure</text><ellipse cx='300' cy='210' rx='180' ry='120' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='2'/><circle cx='300' cy='210' r='40' fill='#a5b4fc' stroke='#4f46e5' stroke-width='2'/><text x='300' y='215' text-anchor='middle' font-size='11'>Nucleus</text><text x='400' y='150' font-size='11'>Cytoplasm</text><text x='200' y='150' font-size='11'>Cell Membrane</text></svg>`
  } else {
    svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='#f8fafc'/><rect x='20' y='20' width='560' height='360' rx='20' fill='white' stroke='#e2e8f0' stroke-width='2'/><text x='300' y='100' text-anchor='middle' font-size='26' font-weight='800' fill='#0f172a'>${topic.toUpperCase().slice(0,30)}</text><circle cx='300' cy='200' r='70' fill='#e0f2fe' stroke='#0ea5e9' stroke-width='3'/><text x='300' y='206' text-anchor='middle' font-size='14' font-weight='bold' fill='#0c4a6e'>CONCEPT</text><text x='300' y='280' text-anchor='middle' font-size='13' fill='#334155'>Educational Diagram</text><text x='300' y='350' text-anchor='middle' font-size='11' fill='#94a3b8'>NAWAZ AI ACADEMY - Rawalpindi</text></svg>`
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]); const [activeId, setActiveId] = useState(""); const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [isListening, setIsListening] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const s = localStorage.getItem("nawaz_final_v7"); if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_v7", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])

  const active = chats.find(c => c.id === activeId)

  function startVoice() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SR) return; const rec = new SR(); rec.lang = "en-US"; rec.onstart = () => setIsListening(true); rec.onend = () => setIsListening(false)
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript); rec.start()
  }

  async function send() {
    if (!input.trim() ||!active) return; const q = input; setInput(""); setLoading(true)
    const diagramUrl = makeDiagram(q)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? q.slice(0, 26) : c.title, msgs: [...c.msgs, { q, a: "...", diagram: diagramUrl }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) }); const d = await res.json()
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply } : m) } : c)); setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, system-ui', background: '#fff' }}>
      <style>{`@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,.6)}70%{box-shadow:0 0 0 12px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}`}</style>
      <div style={{ width: '280px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0' }}>NAWAZ AI ACADEMY</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
        <div style={{ fontSize: '10px', opacity: 0.35, textAlign: 'center' }}>NAWAZ PUBLICATION<br />Rawalpindi</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ PUBLICATION - NAWAZ AI ACADEMY</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.length === 0 && <div style={{ textAlign: 'center', marginTop: '60px' }}><h1 style={{ fontSize: '28px', fontWeight: 900 }}>NAWAZ AI ACADEMY</h1><p style={{ color: '#666' }}>Search any topic + Diagram</p></div>}
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div></div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><ColorfulAnswer text={m.a} /></div>
                <div style={{ flex: '0 1 300px', background: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '6px' }}><img src={m.diagram} style={{ width: '100%', borderRadius: '12px' }} alt="diagram" /><div style={{ fontSize: '10px', color: '#999', textAlign: 'center', marginTop: '4px' }}>Diagram: {m.q}</div></div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '10px', alignItems: 'center', background: '#f4f4f5', borderRadius: '9999px', padding: '8px 10px', border: '1px solid #e5e7eb' }}>
            <button onClick={startVoice} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: isListening? '#ef4444' : '#111', color: '#fff', cursor: 'pointer', animation: isListening? 'pulse 1.5s infinite' : 'none' }}>{isListening? '●' : '🎙️'}</button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Search..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }} />
            <button onClick={send} style={{ width: '46px', height: '46px', borderRadius: '50%', border: 'none', background: '#000', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>{loading? '⋯' : '↗'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
