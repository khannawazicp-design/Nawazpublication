"use client"
import { useState, useEffect, useRef } from "react"
type Chat = { id: string, title: string, msgs: { q: string, a: string, img?: string }[] }

export default function Home(){
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    const s = localStorage.getItem("nawaz_final_v3")
    if(s){ const p=JSON.parse(s); setChats(p); setActiveId(p[0]?.id||"") } 
    else { const id=Date.now().toString(); const c={id, title:"New Chat", msgs:[]}; setChats([c]); setActiveId(id) }
  },[])
  useEffect(()=>{ if(chats.length) localStorage.setItem("nawaz_final_v3", JSON.stringify(chats)) },[chats])

  function createNew(){ const id=Date.now().toString(); const c={id, title:"New Chat", msgs:[]}; setChats(x=>[c,...x]); setActiveId(id) }
  const active = chats.find(c=>c.id===activeId)

  function startVoice(){
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if(!SR){ alert("Chrome browser use karein voice ke liye"); return }
    const rec = new SR(); rec.lang="ur-PK"; rec.onstart=()=>setIsListening(true); rec.onend=()=>setIsListening(false)
    rec.onresult=(e:any)=> setInput(e.results[0][0].transcript); rec.start()
  }

  async function handleFile(e:any){
    const file=e.target.files[0]; if(!file) return
    const reader=new FileReader()
    reader.onload=()=> {
      const img=reader.result as string
      setChats(p=>p.map(c=> c.id===activeId? {...c, title: "Poster Upload", msgs:[...c.msgs, {q:"Ye poster check karo", a:"Poster mil gaya! NAWAZ AI ACADEMY isko analyse kar raha hai...", img}]} : c))
    }
    reader.readAsDataURL(file)
  }

  async function send(){
    if(!input.trim()||!active) return
    const q=input; setInput(""); setLoading(true)
    const isPoster = q.toLowerCase().includes("poster") || q.toLowerCase().includes("پوسٹر")
    let imgUrl = ""
    if(isPoster){
      const prompt = encodeURIComponent(q + " educational poster, Nawaz Publication style")
      imgUrl = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=1000&nologo=true`
    }
    setChats(p=>p.map(c=> c.id===activeId? {...c, title: c.msgs.length===0? q.slice(0,25) : c.title, msgs:[...c.msgs, {q, a:"...", img: imgUrl}]} : c))
    
    const res=await fetch("/api/chat",{method:"POST", body:JSON.stringify({message:q})})
    const d=await res.json()
    setChats(p=>p.map(c=> c.id===activeId? {...c, msgs: c.msgs.map((m,i)=> i===c.msgs.length-1? {...m, a:d.reply, img: m.img} : m)} : c))
    setLoading(false)
  }

  return(
    <div style={{display:'flex', height:'100vh', fontFamily:'system-ui', background:'#fff'}}>
      <div style={{width:'270px', background:'#111', color:'#fff', display:'flex', flexDirection:'column', padding:'12px'}}>
        <div style={{padding:'10px 0 15px', fontWeight:800, textAlign:'center', letterSpacing:'1px'}}>NAWAZ AI ACADEMY</div>
        <button onClick={createNew} style={{padding:'12px', background:'#2a2a2a', color:'#fff', borderRadius:'10px', border:'1px solid #333', cursor:'pointer'}}>+ New Chat</button>
        <div style={{flex:1, overflow:'auto', marginTop:'15px'}}>
          {chats.map(c=><div key={c.id} onClick={()=>setActiveId(c.id)} style={{padding:'10px', borderRadius:'8px', cursor:'pointer', background: activeId===c.id?'#2a2a2a':'transparent', fontSize:'13px', marginBottom:'4px'}}>{c.title}</div>)}
        </div>
        <div style={{fontSize:'10px', opacity:0.5, textAlign:'center', borderTop:'1px solid #222', paddingTop:'10px'}}>NAWAZ PUBLICATION<br/>Rawalpindi</div>
      </div>

      <div style={{flex:1, display:'flex', flexDirection:'column'}}>
        <div style={{background:'#000', color:'#fff', padding:'12px', textAlign:'center', fontWeight:'bold', fontSize:'14px'}}>NAWAZ PUBLICATION - NAWAZ AI ACADEMY - Rawalpindi</div>
        
        <div style={{flex:1, overflow:'auto', maxWidth:'800px', width:'100%', margin:'0 auto', padding:'20px', paddingBottom:'100px'}}>
          {active?.msgs.length===0 && <div style={{textAlign:'center', marginTop:'60px'}}><h1 style={{fontSize:'26px', fontWeight:800}}>NAWAZ AI ACADEMY</h1><p style={{color:'#666'}}>بول کر پوچھیں، پوسٹر بنوائیں، پیپر تیار کریں</p></div>}
          {active?.msgs.map((m,i)=><div key={i} style={{marginBottom:'22px'}}>
            <div style={{display:'flex', justifyContent:'flex-end'}}><div style={{background:'#000', color:'#fff', padding:'10px 16px', borderRadius:'18px', maxWidth:'80%'}}>{m.q}</div></div>
            {m.img && <div style={{marginTop:'10px'}}><img src={m.img} style={{maxWidth:'100%', borderRadius:'12px', border:'1px solid #ddd'}} alt="poster"/></div>}
            <div style={{background:'#f6f6f6', border:'1px solid #eee', padding:'14px', borderRadius:'12px', marginTop:'8px', whiteSpace:'pre-wrap', lineHeight:'1.6'}}>{m.a}</div>
          </div>)}
        </div>

        <div style={{padding:'12px', borderTop:'1px solid #eee', background:'#fff'}}>
          <div style={{maxWidth:'800px', margin:'0 auto', display:'flex', gap:'8px', alignItems:'center', background:'#f2f2f2', borderRadius:'28px', padding:'6px 6px 6px 14px'}}>
            <button onClick={()=>fileRef.current?.click()} style={{background:'#fff', border:'1px solid #ddd', width:'40px', height:'40px', borderRadius:'50%', cursor:'pointer'}}>🖼️</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
            
            <button onClick={startVoice} style={{background: isListening?'#ff2a2a':'#000', color:'#fff', width:'40px', height:'40px', borderRadius:'50%', border:'none', cursor:'pointer'}}>{isListening?'●':'🎤'}</button>

            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="بولیں یا لکھیں..." style={{flex:1, background:'transparent', border:'none', outline:'none', fontSize:'15px'}}/>
            <button onClick={send} style={{width:'42px', height:'42px', borderRadius:'50%', background:'#000', color:'#fff', border:'none', cursor:'pointer'}}>{loading?'..':'↑'}</button>
          </div>
          <div style={{textAlign:'center', fontSize:'10px', color:'#999', marginTop:'6px'}}>NAWAZ AI ACADEMY can make mistakes</div>
        </div>
      </div>
    </div>
  )
}
