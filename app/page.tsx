"use client"
import { useState, useEffect, useRef } from "react"
type Msg = { q: string, a: string, img?: string, diagram?: string }
type Chat = { id: string, title: string, msgs: Msg[] }

function ColorfulAnswer({ text }: { text: string }){
  const lines = text.split("\n")
  return (
    <div style={{lineHeight:'1.9', fontSize:'14.5px'}}>
      {lines.map((line,i)=>{
        const l = line.trim()
        if(!l) return <div key={i} style={{height:'8px'}}/>
        if(l.toLowerCase().startsWith("definition:")){
          return <div key={i} style={{color:'#0f172a', fontWeight:800, fontSize:'16px', background:'#f1f5f9', padding:'6px 10px', borderRadius:'8px', borderLeft:'4px solid #0ea5e9'}}>{l}</div>
        }
        if(l.toLowerCase().startsWith("key points:") || l.toLowerCase().startsWith("aham nukte:")){
          return <div key={i} style={{color:'#dc2626', fontWeight:800, marginTop:'10px', fontSize:'15px'}}>🔴 {l}</div>
        }
        if(l.match(/^\d+\./)){
          return <div key={i} style={{color:'#1e293b', paddingLeft:'10px', borderLeft:'2px solid #e2e8f0', margin:'4px 0'}}>• {l.replace(/^\d+\.\s*/,"")}</div>
        }
        if(l.toLowerCase().startsWith("example:") || l.toLowerCase().startsWith("misal:")){
          return <div key={i} style={{color:'#15803d', fontWeight:700, background:'#f0fdf4', padding:'6px 10px', borderRadius:'8px', borderLeft:'4px solid #22c55e', marginTop:'10px'}}>🟢 {l}</div>
        }
        if(l.includes("NAWAZ AI ACADEMY")){
          return <div key={i} style={{color:'#7c3aed', fontWeight:800, fontSize:'12px', marginTop:'12px', textAlign:'right'}}>{l}</div>
        }
        return <div key={i} style={{color:'#334155'}}>{l}</div>
      })}
    </div>
  )
}

export default function Home(){
  // ... aapka purana state wala code same rahega
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    const s = localStorage.getItem("nawaz_v4_pro")
    if(s){ const p=JSON.parse(s); setChats(p); setActiveId(p[0]?.id||"") } 
    else { const id=Date.now().toString(); setChats([{id, title:"New Chat", msgs:[]}]); setActiveId(id) }
  },[])
  useEffect(()=>{ if(chats.length) localStorage.setItem("nawaz_v4_pro", JSON.stringify(chats)) },[chats])
  const active = chats.find(c=>c.id===activeId)

  function startVoice(){
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if(!SR) return
    const rec = new SR(); rec.lang="en-US"; rec.onstart=()=>setIsListening(true); rec.onend=()=>setIsListening(false)
    rec.onresult=(e:any)=> setInput(e.results[0][0].transcript); rec.start()
  }

  async function send(){
    if(!input.trim() || !active) return
    const q = input; setInput(""); setLoading(true)

    // Diagram logic - har topic ke liye auto diagram
    const lower = q.toLowerCase()
    let diagramPrompt = ""
    if(lower.includes("photosynthesis")) diagramPrompt = "Photosynthesis process diagram, chloroplast, sunlight, clean educational diagram"
    else if(lower.includes("heart")) diagramPrompt = "Human heart anatomical diagram labeled, educational"
    else if(lower.includes("derivative") || lower.includes("metric") || lower.includes("graph")) diagramPrompt = `Mathematical graph of ${q}, calculus diagram, clean white background`
    else if(lower.includes("chemical") || lower.includes("reaction")) diagramPrompt = `Chemical reaction diagram of ${q}, lab style`
    else diagramPrompt = `Educational diagram of ${q}, textbook illustration, clean`

    const diagramUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(diagramPrompt)}?width=800&height=600&nologo=true&seed=${Date.now()}`

    setChats(p=>p.map(c=> c.id===activeId? {...c, title: c.msgs.length===0? q.slice(0,25):c.title, msgs:[...c.msgs, {q, a:"...", diagram: diagramUrl}]} : c))

    const res = await fetch("/api/chat",{method:"POST", body:JSON.stringify({message:q})})
    const d = await res.json()
    setChats(p=>p.map(c=> c.id===activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a:d.reply, diagram: m.diagram} : m)} : c))
    setLoading(false)
  }

  return (
    <div style={{display:'flex', height:'100vh'}}>
      {/* Sidebar same */}
      <div style={{width:'280px', background:'#0a0a0a', color:'#fff', padding:'14px', display:'flex', flexDirection:'column'}}>
        <div style={{fontWeight:900, textAlign:'center', padding:'12px 0'}}>NAWAZ AI ACADEMY</div>
        <button onClick={()=>{const id=Date.now().toString(); setChats(x=>[{id, title:"New Chat", msgs:[]},...x]); setActiveId(id)}} style={{padding:'12px', background:'#1a1a1a', color:'#fff', borderRadius:'12px', border:'1px solid #222'}}> + New Chat</button>
        <div style={{flex:1, overflow:'auto', marginTop:'15px'}}>{chats.map(c=><div key={c.id} onClick={()=>setActiveId(c.id)} style={{padding:'10px', background: activeId===c.id?'#1e1e1e':'transparent', borderRadius:'10px', marginBottom:'6px', cursor:'pointer', fontSize:'13px'}}>{c.title}</div>)}</div>
      </div>

      <div style={{flex:1, display:'flex', flexDirection:'column', background:'#fbfbfb'}}>
        <div style={{background:'#000', color:'#fff', padding:'12px', textAlign:'center', fontWeight:700, fontSize:'13px'}}>NAWAZ PUBLICATION - NAWAZ AI ACADEMY</div>
        
        <div style={{flex:1, overflow:'auto', padding:'20px', maxWidth:'900px', width:'100%', margin:'0 auto'}}>
          {active?.msgs.map((m,i)=><div key={i} style={{marginBottom:'28px'}}>
            <div style={{display:'flex', justifyContent:'flex-end'}}><div style={{background:'#111', color:'#fff', padding:'10px 16px', borderRadius:'18px'}}>{m.q}</div></div>
            
            {/* DIAGRAM + TEXT SIDE BY SIDE */}
            <div style={{display:'flex', gap:'16px', flexWrap:'wrap', marginTop:'12px'}}>
              <div style={{flex:'1 1 320px', background:'#fff', border:'1px solid #eee', borderRadius:'16px', padding:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.04)'}}>
                <ColorfulAnswer text={m.a}/>
              </div>
              {m.diagram && <div style={{flex:'0 1 320px'}}><img src={m.diagram} style={{width:'100%', borderRadius:'16px', border:'1px solid #e5e7eb', boxShadow:'0 10px 30px rgba(0,0,0,0.08)'}} alt="diagram"/><div style={{fontSize:'11px', color:'#888', textAlign:'center', marginTop:'6px'}}>Diagram: {m.q} - NAWAZ AI ACADEMY</div></div>}
            </div>
          </div>)}
        </div>

        {/* PROFESSIONAL BUTTONS BAR */}
        <div style={{padding:'16px', background:'#fff', borderTop:'1px solid #f0f0f0'}}>
          <div style={{maxWidth:'860px', margin:'0 auto', display:'flex', gap:'12px', alignItems:'center', background:'#f4f4f5', borderRadius:'9999px', padding:'8px 12px', boxShadow:'0 8px 24px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb'}}>
            
            <button onClick={()=>fileRef.current?.click()} style={{width:'46px', height:'46px', borderRadius:'50%', border:'none', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', cursor:'pointer', fontSize:'20px'}}>📎</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}}/>

            <button onClick={startVoice} style={{width:'46px', height:'46px', borderRadius:'50%', border:'none', cursor:'pointer', background: isListening?'#ef4444':'#111', color:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.15)', transition:'all 0.2s', transform: isListening?'scale(1.1)':'scale(1)'}}>{isListening?'●':'🎙️'}</button>

            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Search any topic - Photosynthesis, Heart, Derivative..." style={{flex:1, background:'transparent', border:'none', outline:'none', fontSize:'15px'}}/>

            <button onClick={send} style={{width:'48px', height:'48px', borderRadius:'50%', border:'none', cursor:'pointer', background:'linear-gradient(135deg, #000 0%, #334155 100%)', color:'#fff', fontSize:'22px', boxShadow:'0 6px 16px rgba(0,0,0,0.2)'}}>↗</button>
          </div>
        </div>

      </div>
    </div>
  )
}
