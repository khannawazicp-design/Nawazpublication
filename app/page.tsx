"use client"
import { useState, useEffect } from "react"

type Chat = { id: string, title: string, msgs: { q: string, a: string }[] }

export default function Home(){
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const s = localStorage.getItem("nawaz_final")
    if(s){ const p=JSON.parse(s); setChats(p); setActiveId(p[0]?.id || "") } else { createNew() }
  },[])
  useEffect(()=>{ if(chats.length) localStorage.setItem("nawaz_final", JSON.stringify(chats)) },[chats])

  function createNew(){
    const id=Date.now().toString()
    setChats(c=>[{id, title:"New Chat", msgs:[]},...c]); setActiveId(id)
  }
  const active = chats.find(c=>c.id===activeId)

  async function send(){
    if(!input.trim() ||!active) return
    const q=input; setInput(""); setLoading(true)
    setChats(p=>p.map(c=> c.id===activeId? {...c, title: c.msgs.length===0? q.slice(0,25) : c.title, msgs:[...c.msgs, {q, a:"Soch raha hu..."}]} : c))
    const res=await fetch("/api/chat",{method:"POST", body:JSON.stringify({message:q})})
    const d=await res.json()
    setChats(p=>p.map(c=> c.id===activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a:d.reply} : m)} : c))
    setLoading(false)
  }

  return(
    <div style={{display:'flex', height:'100vh', fontFamily:'system-ui', background:'#f5f5f7'}}>
      <div style={{width:'280px', background:'#111', color:'#fff', display:'flex', flexDirection:'column', padding:'10px'}}>
        <button onClick={createNew} style={{padding:'12px', background:'#fff', color:'#111', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>+ New Chat</button>
        <div style={{marginTop:'15px', flex:1, overflow:'auto'}}>
          {chats.map(c=><div key={c.id} onClick={()=>setActiveId(c.id)} style={{padding:'10px', borderRadius:'6px', marginBottom:'5px', cursor:'pointer', background: activeId===c.id? '#333' : 'transparent', fontSize:'14px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.title}</div>)}
        </div>
        <div style={{padding:'10px', fontSize:'12px', opacity:0.6, borderTop:'1px solid #333', textAlign:'center'}}>NAWAZ PUBLICATION<br/>Rawalpindi</div>
      </div>

      <div style={{flex:1, display:'flex', flexDirection:'column'}}>
        <div style={{flex:1, overflow:'auto', maxWidth:'800px', width:'100%', margin:'0 auto', padding:'20px', paddingBottom:'100px'}}>
          {active?.msgs.length===0 && (
            <div style={{textAlign:'center', marginTop:'80px'}}>
              <h1 style={{fontSize:'32px', fontWeight:800}}>Nawaz Academy AI</h1>
              <p style={{color:'#666'}}>9th, 10th, Matrix, Science ka koi bhi sawal pocho</p>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'30px'}}>
                <div onClick={()=>setInput("Matrix kya hai? Example ke sath")} style={{border:'1px solid #ddd', padding:'15px', borderRadius:'12px', background:'#fff', cursor:'pointer'}}>🧮 Matrix Example</div>
                <div onClick={()=>setInput("9th Physics Guess Paper 2025")} style={{border:'1px solid #ddd', padding:'15px', borderRadius:'12px', background:'#fff', cursor:'pointer'}}>📄 9th Guess Paper</div>
              </div>
            </div>
          )}
          {active?.msgs.map((m,i)=><div key={i} style={{marginBottom:'20px'}}>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:'10px'}}><div style={{background:'#000', color:'#fff', padding:'10px 16px', borderRadius:'18px', maxWidth:'80%'}}>{m.q}</div></div>
            <div style={{background:'#fff', border:'1px solid #e5e5e5', padding:'16px', borderRadius:'12px', whiteSpace:'pre-wrap', lineHeight:'1.6'}}>{m.a}</div>
          </div>)}
        </div>
        <div style={{position:'sticky', bottom:0, background:'#fff', borderTop:'1px solid #ddd', padding:'12px'}}>
          <div style={{maxWidth:'800px', margin:'0 auto', display:'flex', gap:'8px'}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Matrix, Paper ya koi sawal likhein..." style={{flex:1, border:'1px solid #ddd', borderRadius:'24px', padding:'12px 18px', outline:'none'}}/>
            <button onClick={send} style={{width:'48px', height:'48px', borderRadius:'50%', background:'#000', color:'#fff', fontSize:'20px'}}>{loading?'..':'↑'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
