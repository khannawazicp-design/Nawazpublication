"use client";
import { useState } from "react";
export default function Home(){
  const [q,setQ]=useState(""); const [list,setList]=useState<any[]>([]); const [lang,setLang]=useState("ur"); const [load,setLoad]=useState(false);
  async function search(){
    if(!q.trim()) return; const qq=q; setQ(""); setList(s=>[...s,{r:"u",t:qq}]); setLoad(true);
    if(qq.toLowerCase()==="hi"){ setList(s=>[...s,{r:"a",t:"Wa Alaikum Salam! Koi topic likhen - Sequence, Photosynthesis"}]); setLoad(false); return; }
    try{
      const r = await fetch("/api/chat",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message:qq, lang})});
      const d = await r.json(); setList(s=>[...s,{r:"a",t:d.reply}]);
    }catch(e){ setList(s=>[...s,{r:"a",t:"Error"}]); }
    setLoad(false);
  }
  return(
    <div style={{minHeight:"100vh", background:"#0f0f0f", color:"white", display:"flex", flexDirection:"column"}}>
      <div style={{padding:14, textAlign:"center", borderBottom:"1px solid #222"}}><b>NawazPublication - AI Notes</b>
        <div style={{marginTop:8, display:"flex", gap:8, justifyContent:"center"}}>
          <button onClick={()=>setLang("ur")} style={{padding:"6px 14px", borderRadius:20, background:lang==="ur"?"white":"#222", color:lang==="ur"?"black":"white"}}>اردو</button>
          <button onClick={()=>setLang("en")} style={{padding:"6px 14px", borderRadius:20, background:lang==="en"?"white":"#222", color:lang==="en"?"black":"white"}}>English</button>
        </div>
      </div>
      <div style={{flex:1, maxWidth:700, width:"100%", margin:"0 auto", padding:14}}>
        {list.map((m,i)=><div key={i} style={{background:m.r==="u"?"#2f2f2f":"#171717", border:"1px solid #333", padding:14, borderRadius:14, marginBottom:10, whiteSpace:"pre-wrap"}}>{m.t}</div>)}
        {load && <div>AI soch raha hai...</div>}
      </div>
      <div style={{padding:12, position:"sticky", bottom:0, background:"#0f0f0f", borderTop:"1px solid #222"}}>
        <div style={{maxWidth:700, margin:"0 auto", display:"flex", background:"#1e1e1e", borderRadius:28, padding:"4px 10px"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="Topic likhen..." style={{flex:1, background:"transparent", border:"none", outline:"none", color:"white", padding:12}}/>
          <button onClick={search} style={{background:"white", color:"black", borderRadius:50, width:38, height:38, border:"none"}}>↑</button>
        </div>
      </div>
    </div>
  )
}
