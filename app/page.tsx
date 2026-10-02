"use client";
import { useState } from "react";
export default function Home(){
  const [q,setQ]=useState("");const [ans,setAns]=useState("");const [loading,setLoading]=useState(false);
  async function askAI(){
    if(!q.trim()) return; setLoading(true); setAns("");
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
      const data=await res.json(); setAns(data.answer||"Jawab nahi mila");
    }catch(e:any){setAns("Error: "+e.message)} setLoading(false);
  }
  return(
    <main style={{fontFamily:'system-ui',background:'#FFFBEB',minHeight:'100vh'}}>
      <header style={{background:'white',padding:'12px 20px',display:'flex',justifyContent:'space-between',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <h1 style={{fontWeight:900,margin:0,fontSize:'22px'}}>Nawaz<span style={{color:'#d97706'}}>Academy</span></h1>
        <a href="https://wa.me/923000000000" style={{background:'#16a34a',color:'white',padding:'8px 14px',borderRadius:'20px',textDecoration:'none',fontWeight:'bold'}}>WhatsApp</a>
      </header>
      <section style={{maxWidth:'650px',margin:'0 auto',padding:'30px 20px',textAlign:'center'}}>
        <h2 style={{fontSize:'32px',fontWeight:900}}>AI-Powered Notes for<br/><span style={{color:'#d97706'}}>Every Student</span></h2>
        <div style={{background:'white',padding:'16px',borderRadius:'16px',marginTop:'24px',boxShadow:'0 8px 20px rgba(0,0,0,0.08)',textAlign:'left'}}>
          <div style={{display:'flex',gap:'8px'}}>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askAI()} placeholder="Sawal likhen..." style={{flex:1,border:'1px solid #ddd',padding:'12px',borderRadius:'10px'}}/>
            <button onClick={askAI} style={{background:'black',color:'white',padding:'12px 18px',borderRadius:'10px',border:'none',fontWeight:'bold'}}>{loading?"...":"Search"}</button>
          </div>
          {ans&&<div style={{marginTop:'14px',background:'#FFFBEB',padding:'14px',borderRadius:'10px',whiteSpace:'pre-wrap',lineHeight:'1.6'}}>{ans}</div>}
        </div>
      </section>
    </main>
  )
}
