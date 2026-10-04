"use client"
import { useState, useEffect, useRef } from "react"

type Msg = { q: string, a: string, diagram: string | null }
type Chat = { id: string, title: string, msgs: Msg[] }

function getBookDiagram(topic: string) {
  const t = topic.toLowerCase()
  if (t.includes("photosynthesis")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Photosynthesis_en.svg/800px-Photosynthesis_en.svg.png"
  if (t.includes("heart")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Diagram_of_the_human_heart_%28cropped%29.svg/800px-Diagram_of_the_human_heart_%28cropped%29.svg.png"
  if (t.includes("animal cell")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Animal_cell_structure_en.svg/800px-Animal_cell_structure_en.svg.png"
  if (t.includes("plant cell") || t.includes("cell")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Plant_cell_structure-en.svg/800px-Plant_cell_structure-en.svg.png"
  if (t.includes("water cycle") || t.includes("water")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Water_cycle_blank.svg/800px-Water_cycle_blank.svg.png"
  if (t.includes("dna")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/DNA-structure-and-bases.png/800px-DNA-structure-and-bases.png"
  if (t.includes("atom")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Atom_Diagram.svg/600px-Atom_Diagram.svg.png"
  if (t.includes("brain")) return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Gehirn%2C_medial_-_II.svg/800px-Gehirn%2C_medial_-_II.svg.png"
  const clean = topic.replace(/class \d+|diagram/gi, "").trim()
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(`professional textbook labeled diagram of ${clean}, colorful, white background`)}?width=1024&height=768&model=flux&nologo=true&seed=${Date.now()}`
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
    const s = localStorage.getItem("nawaz_final_v3")
    if (s) { const p = JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") }
    else { const id = Date.now().toString(); setChats([{ id, title: "New Chat", msgs: [] }]); setActiveId(id) }
  }, [])
  useEffect(() => { if (chats.length) localStorage.setItem("nawaz_final_v3", JSON.stringify(chats)) }, [chats])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chats])

  const active = chats.find(c => c.id === activeId)

  async function send() {
    if (!input.trim() ||!active) return
    const q = input; setInput(""); setLoading(true)
    setChats(p => p.map(c => c.id === activeId? {...c, title: c.msgs.length === 0? q.slice(0, 24) : c.title, msgs: [...c.msgs, { q, a: "...", diagram: null }] } : c))
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) })
    const d = await res.json()
    let diag = null
    if (d.needsDiagram) diag = getBookDiagram(q)
    setChats(p => p.map(c => c.id === activeId? {...c, msgs: c.msgs.map((m, i) => i === c.msgs.length - 1? {...m, a: d.reply, diagram: diag } : m) } : c))
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ width: '260px', background: '#0a0a0a', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 900, textAlign: 'center', padding: '12px 0' }}>NAWAZ AI ACADEMY</div>
        <button onClick={() => { const id = Date.now().toString(); setChats(x => [{ id, title: "New Chat", msgs: [] },...x]); setActiveId(id) }} style={{ padding: '12px', background: '#1a1a1a', color: '#fff', borderRadius: '12px', border: '1px solid #222', cursor: 'pointer' }}>+ New Chat</button>
        <div style={{ flex: 1, overflow: 'auto', marginTop: '14px' }}>{chats.map(c => <div key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: '10px', borderRadius: '10px', background: activeId === c.id? '#1e1e1e' : 'transparent', marginBottom: '6px', cursor: 'pointer', fontSize: '13px' }}>{c.title}</div>)}</div>
        <div style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '10px' }}>NAWAZ PUBLICATION<br/>Rawalpindi</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fbfbfb' }}>
        <div style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>NAWAZ PUBLICATION - NAWAZ AI ACADEMY</div>
        <div style={{ flex: 1, overflow: 'auto', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '20px 16px 120px' }}>
          {active?.msgs.map((m, i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' }}>{m.q}</div></div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '12px' }}>
                <div style={{ flex: '1 1 340px', background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '16px' }}><ColorfulAnswer text={m.a} /></div>
                {m.diagram && <div style={{ flex: '0 1 320px', background: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '6px' }}><img src={m.diagram} style={{ width: '100%', borderRadius: '12px' }} alt="diagram" /><div style={{ fontSize: '10px', textAlign: 'center', color: '#999', marginTop: '4px' }}>Real Textbook Diagram - NAWAZ AI ACADEMY</div></div>}
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
